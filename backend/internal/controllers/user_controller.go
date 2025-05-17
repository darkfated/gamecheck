package controllers

import (
	"fmt"
	"net/http"

	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

// UserController обрабатывает запросы, связанные с пользователями
type UserController struct {
	userService    *services.UserService
	authController *AuthController // Добавляем ссылку на AuthController
}

// NewUserController создает новый экземпляр контроллера пользователей
func NewUserController(userService *services.UserService, authController *AuthController) *UserController {
	return &UserController{
		userService:    userService,
		authController: authController,
	}
}

// RegisterRoutes регистрирует маршруты для пользователей
func (c *UserController) RegisterRoutes(router *gin.RouterGroup) {
	users := router.Group("/users")
	{
		users.GET("/:id", c.GetUserProfile)
		users.GET("/search/:query", c.SearchUsers)
		users.PATCH("/profile", c.AuthRequired(), c.UpdateProfile)
	}

	subscriptions := router.Group("/subscriptions")
	{
		subscriptions.GET("/:id/followers", c.GetFollowers)
		subscriptions.GET("/:id/following", c.GetFollowing)
		subscriptions.POST("/follow/:id", c.AuthRequired(), c.FollowUser)
		subscriptions.DELETE("/unfollow/:id", c.AuthRequired(), c.UnfollowUser)
	}
}

// GetUserProfile возвращает профиль пользователя
func (c *UserController) GetUserProfile(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID пользователя не указан"})
		return
	}

	// Получаем текущего пользователя, если он аутентифицирован
	var currentUserID string
	userIDValue, exists := ctx.Get("userID")
	if exists {
		currentUserID = userIDValue.(string)
	}

	user, err := c.userService.GetUserProfile(ctx, id, currentUserID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении профиля: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

// UpdateProfile обновляет профиль пользователя
func (c *UserController) UpdateProfile(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	var profileData struct {
		Bio       *string `json:"bio"`
		TwitterID *string `json:"twitterId"`
		TwitchID  *string `json:"twitchId"`
	}

	if err := ctx.ShouldBindJSON(&profileData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Неверный формат данных: %v", err)})
		return
	}

	user, err := c.userService.UpdateProfile(
		ctx,
		userID.(string),
		profileData.Bio,
		profileData.TwitterID,
		profileData.TwitchID,
	)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при обновлении профиля: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

// SearchUsers выполняет поиск пользователей по запросу
func (c *UserController) SearchUsers(ctx *gin.Context) {
	query := ctx.Param("query")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Поисковый запрос не указан"})
		return
	}

	users, err := c.userService.SearchUsers(ctx, query)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при поиске пользователей: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, users)
}

// GetFollowers возвращает список подписчиков пользователя
func (c *UserController) GetFollowers(ctx *gin.Context) {
	userID := ctx.Param("id")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID пользователя не указан"})
		return
	}

	followers, err := c.userService.GetFollowers(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении списка подписчиков: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, followers)
}

// GetFollowing возвращает список пользователей, на которых подписан данный пользователь
func (c *UserController) GetFollowing(ctx *gin.Context) {
	userID := ctx.Param("id")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID пользователя не указан"})
		return
	}

	following, err := c.userService.GetFollowing(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении списка подписок: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, following)
}

// FollowUser подписывает пользователя на другого пользователя
func (c *UserController) FollowUser(ctx *gin.Context) {
	followerID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	followingID := ctx.Param("id")
	if followingID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID пользователя не указан"})
		return
	}

	if followerID.(string) == followingID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Нельзя подписаться на самого себя"})
		return
	}

	if err := c.userService.FollowUser(ctx, followerID.(string), followingID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при подписке: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Подписка успешно оформлена"})
}

// UnfollowUser отписывает пользователя от другого пользователя
func (c *UserController) UnfollowUser(ctx *gin.Context) {
	followerID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	followingID := ctx.Param("id")
	if followingID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID пользователя не указан"})
		return
	}

	if err := c.userService.UnfollowUser(ctx, followerID.(string), followingID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при отписке: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Отписка успешно выполнена"})
}

// AuthRequired использует AuthMiddleware из AuthController для проверки аутентификации
func (c *UserController) AuthRequired() gin.HandlerFunc {
	// Используем AuthMiddleware из AuthController
	return c.authController.AuthMiddleware()
}
