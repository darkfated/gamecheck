package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"gamecheck/config"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

// AuthController обрабатывает запросы, связанные с аутентификацией
type AuthController struct {
	config      *config.Config
	authService *services.AuthService
}

// NewAuthController создает новый экземпляр контроллера аутентификации
func NewAuthController(cfg *config.Config, authService *services.AuthService) *AuthController {
	return &AuthController{
		config:      cfg,
		authService: authService,
	}
}

// RegisterRoutes регистрирует маршруты для аутентификации
func (c *AuthController) RegisterRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		auth.GET("/steam", c.SteamLogin)
		auth.GET("/steam/callback", c.SteamCallback)
		auth.GET("/check", c.AuthMiddleware(), c.CheckAuth)
		auth.GET("/current", c.AuthMiddleware(), c.GetCurrentUser)
		auth.POST("/logout", c.LogoutHandler)
		auth.GET("/validate-token", c.ValidateTokenHandler)
	}
}

// SteamLogin инициирует процесс аутентификации через Steam
func (c *AuthController) SteamLogin(ctx *gin.Context) {
	steamLoginURL := fmt.Sprintf(
		"https://steamcommunity.com/openid/login?"+
			"openid.ns=http://specs.openid.net/auth/2.0&"+
			"openid.mode=checkid_setup&"+
			"openid.return_to=%s&"+
			"openid.realm=http://localhost:%s&"+
			"openid.identity=http://specs.openid.net/auth/2.0/identifier_select&"+
			"openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select",
		c.config.SteamAPI.RedirectURI,
		c.config.Port,
	)

	ctx.Redirect(http.StatusTemporaryRedirect, steamLoginURL)
}

// SteamCallback обрабатывает ответ от Steam после аутентификации
func (c *AuthController) SteamCallback(ctx *gin.Context) {
	claimedID := ctx.Query("openid.claimed_id")
	if claimedID == "" {
		c.handleAuthError(ctx, http.StatusBadRequest, "Не удалось получить SteamID")
		return
	}

	parts := strings.Split(claimedID, "/")
	if len(parts) == 0 {
		c.handleAuthError(ctx, http.StatusBadRequest, "Недопустимый формат SteamID")
		return
	}

	steamID := parts[len(parts)-1]
	fmt.Printf("[AUTH] Получен SteamID: %s\n", steamID)

	steamAPIURL := fmt.Sprintf(
		"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=%s&steamids=%s",
		c.config.SteamAPI.APIKey,
		steamID,
	)

	// Добавляем больше логирования
	fmt.Printf("[AUTH] Запрос к Steam API: %s\n", steamAPIURL)

	resp, err := http.Get(steamAPIURL)
	if err != nil {
		fmt.Printf("[AUTH ERROR] Ошибка HTTP при обращении к Steam API: %v\n", err)
		c.handleAuthError(ctx, http.StatusInternalServerError, "Ошибка при обращении к Steam API: "+err.Error())
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("[AUTH ERROR] Steam API вернул статус %d\n", resp.StatusCode)
		c.handleAuthError(ctx, http.StatusInternalServerError, fmt.Sprintf("Steam API вернул статус %d", resp.StatusCode))
		return
	}

	// Читаем ответ в буфер для логирования и дальнейшей обработки
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("[AUTH ERROR] Ошибка чтения ответа Steam API: %v\n", err)
		c.handleAuthError(ctx, http.StatusInternalServerError, "Ошибка чтения ответа Steam API: "+err.Error())
		return
	}

	// Логируем ответ от Steam API для отладки
	fmt.Printf("[AUTH] Ответ Steam API: %s\n", string(body))

	var steamResponse struct {
		Response struct {
			Players []struct {
				SteamID      string `json:"steamid"`
				PersonaName  string `json:"personaname"`
				ProfileURL   string `json:"profileurl"`
				Avatar       string `json:"avatar"`
				AvatarMedium string `json:"avatarmedium"`
				AvatarFull   string `json:"avatarfull"`
			} `json:"players"`
		} `json:"response"`
	}

	if err := json.Unmarshal(body, &steamResponse); err != nil {
		fmt.Printf("[AUTH ERROR] Ошибка при разборе ответа от Steam API: %v\nТело ответа: %s\n", err, string(body))
		c.handleAuthError(ctx, http.StatusInternalServerError, "Ошибка при разборе ответа от Steam API: "+err.Error())
		return
	}

	if len(steamResponse.Response.Players) == 0 {
		fmt.Printf("[AUTH ERROR] Steam API не вернул данные о пользователе. Ответ: %s\n", string(body))
		c.handleAuthError(ctx, http.StatusInternalServerError, "Steam API не вернул данные о пользователе")
		return
	}

	// Получаем данные пользователя
	player := steamResponse.Response.Players[0]
	displayName := player.PersonaName
	avatarURL := player.AvatarFull
	profileURL := player.ProfileURL

	fmt.Printf("[AUTH] Данные пользователя: %s, %s\n", displayName, steamID)

	// Аутентифицируем пользователя и получаем токен
	token, err := c.authService.AuthenticateWithSteam(ctx, steamID, displayName, avatarURL, profileURL)
	if err != nil {
		fmt.Printf("[AUTH ERROR] Ошибка аутентификации: %v\n", err)
		c.handleAuthError(ctx, http.StatusInternalServerError, "Ошибка аутентификации: "+err.Error())
		return
	}

	fmt.Printf("[AUTH] Пользователь успешно аутентифицирован, токен: %s...\n", token[:10])
	c.setAuthCookie(ctx, token)

	frontendURL := fmt.Sprintf("http://localhost:3000/auth/callback?token=%s", token)
	fmt.Printf("[AUTH] Редирект на: %s\n", frontendURL)
	ctx.Redirect(http.StatusTemporaryRedirect, frontendURL)
}

// Устанавливает cookie с токеном
func (c *AuthController) setAuthCookie(ctx *gin.Context, token string) {
	maxAge := int(c.config.JWT.ExpiresIn.Seconds())

	ctx.SetCookie(
		"token",     // Имя
		token,       // Значение
		maxAge,      // Время жизни в секундах
		"/",         // Путь
		"localhost", // Домен
		false,       // Secure (false для локальной разработки)
		false,       // HttpOnly (false чтобы JS мог читать куки)
	)

	ctx.Header("X-Auth-Token-Set", "true")
	ctx.Header("X-Auth-Token-Expires", fmt.Sprintf("%d", maxAge))
}

// CheckAuth проверяет валидность токена аутентификации
func (c *AuthController) CheckAuth(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if exists {
		fmt.Printf("[AUTH] CheckAuth: Подтверждена аутентификация пользователя: %v\n", userID)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"isAuthenticated": true,
		"timestamp":       time.Now().Unix(),
	})
}

// GetCurrentUser возвращает информацию о текущем пользователе
func (c *AuthController) GetCurrentUser(ctx *gin.Context) {
	user, exists := ctx.Get("user")
	if !exists {
		fmt.Printf("[AUTH] GetCurrentUser: Пользователь не найден в контексте\n")
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	fmt.Printf("[AUTH] GetCurrentUser: Возвращаем данные пользователя\n")
	ctx.JSON(http.StatusOK, user)
}

// LogoutHandler обрабатывает запрос на выход из системы
func (c *AuthController) LogoutHandler(ctx *gin.Context) {
	token := c.extractTokenFromRequest(ctx)

	if token == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Токен не найден"})
		return
	}

	if err := c.authService.Logout(ctx, token); err != nil {
		fmt.Printf("[AUTH ERROR] Не удалось удалить токен: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при выходе: " + err.Error()})
		return
	}

	ctx.SetCookie("token", "", -1, "/", "localhost", false, false)

	fmt.Printf("[AUTH] Успешный выход пользователя\n")
	ctx.JSON(http.StatusOK, gin.H{"message": "Выход выполнен успешно"})
}

// Извлекает токен из запроса (заголовок, параметр, cookie)
func (c *AuthController) extractTokenFromRequest(ctx *gin.Context) string {
	// 1. Проверяем заголовок Authorization
	authHeader := ctx.GetHeader("Authorization")
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token := strings.TrimPrefix(authHeader, "Bearer ")
		fmt.Printf("[AUTH] Токен получен из заголовка Authorization: %s...\n", token[:10])
		return token
	}

	// 2. Проверяем параметр запроса token
	queryToken := ctx.Query("token")
	if queryToken != "" {
		fmt.Printf("[AUTH] Токен получен из параметра запроса: %s...\n", queryToken[:10])
		return queryToken
	}

	// 3. Проверяем cookie
	tokenCookie, err := ctx.Cookie("token")
	if err == nil && tokenCookie != "" {
		fmt.Printf("[AUTH] Токен получен из cookie: %s...\n", tokenCookie[:10])
		return tokenCookie
	}

	fmt.Printf("[AUTH] Токен не найден ни в одном источнике запроса\n")
	return ""
}

// AuthMiddleware создает middleware для проверки аутентификации
func (c *AuthController) AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		fmt.Printf("[AUTH] Проверка аутентификации: %s %s\n", ctx.Request.Method, ctx.FullPath())

		token := c.extractTokenFromRequest(ctx)

		if token == "" {
			fmt.Println("[AUTH] Токен не найден в запросе")
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Требуется аутентификация"})
			ctx.Abort()
			return
		}

		user, err := c.authService.ValidateToken(ctx, token)
		if err != nil {
			fmt.Printf("[AUTH] Ошибка валидации токена: %v\n", err)
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Недействительный токен: " + err.Error()})
			ctx.Abort()
			return
		}

		fmt.Printf("[AUTH] Успешная аутентификация пользователя: %s\n", user.ID)

		ctx.Set("user", user)
		ctx.Set("userID", user.ID)
		ctx.Next()
	}
}

// ValidateTokenHandler проверяет валидность токена без необходимости middleware
func (c *AuthController) ValidateTokenHandler(ctx *gin.Context) {
	fmt.Printf("[AUTH] Запрос на валидацию токена от %s\n", ctx.ClientIP())

	token := c.extractTokenFromRequest(ctx)

	if token == "" {
		fmt.Printf("[AUTH] Токен не найден при валидации\n")
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"isValid":   false,
			"error":     "Токен не предоставлен",
			"timestamp": time.Now().Unix(),
		})
		return
	}

	fmt.Printf("[AUTH] Валидируем токен: %s...\n", token[:10])

	user, err := c.authService.ValidateToken(ctx, token)
	if err != nil {
		fmt.Printf("[AUTH] Ошибка валидации токена: %v\n", err)
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"isValid":   false,
			"error":     "Недействительный токен: " + err.Error(),
			"timestamp": time.Now().Unix(),
		})
		return
	}

	fmt.Printf("[AUTH] Токен успешно валидирован для пользователя: %s\n", user.ID)

	c.setAuthCookie(ctx, token)

	ctx.JSON(http.StatusOK, gin.H{
		"isValid":   true,
		"user":      user,
		"timestamp": time.Now().Unix(),
	})
}

// Обработчик ошибок аутентификации с редиректом на фронтенд
func (c *AuthController) handleAuthError(ctx *gin.Context, status int, message string) {
	fmt.Printf("[AUTH ERROR] %s\n", message)

	// Прямой ответ JSON, если это API запрос
	if strings.HasPrefix(ctx.Request.Header.Get("Accept"), "application/json") {
		ctx.JSON(status, gin.H{"error": message})
		return
	}

	// Иначе редирект на фронтенд с параметром ошибки
	redirectURL := fmt.Sprintf("http://localhost:3000/auth/callback?error=%s", message)
	ctx.Redirect(http.StatusTemporaryRedirect, redirectURL)
}
