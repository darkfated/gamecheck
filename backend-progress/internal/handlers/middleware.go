package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gamecheck/progress-service/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims структура для JWT токена, соответствующая основному бэкенду
type JWTClaims struct {
	UserID string `json:"user_id"`
	jwt.RegisteredClaims
}

// HeaderAuthMiddleware проверяет заголовок X-User-ID, переданный из главного бэкенда
func HeaderAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetHeader("X-User-ID")

		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "авторизация требуется"})
			c.Abort()
			return
		}

		c.Set("userID", userID)
		c.Next()
	}
}

// AuthMiddleware проверяет JWT токен в заголовке Authorization
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetHeader("X-User-ID")
		if userID != "" {
			log.Printf("[AUTH] Получен X-User-ID заголовок: %s", userID)
			c.Set("userID", userID)
			c.Next()
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			log.Printf("[AUTH ERROR] Заголовок Authorization отсутствует")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "авторизация требуется"})
			c.Abort()
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		log.Printf("[AUTH] Получен токен: %s...", tokenString[:10])
		log.Printf("[AUTH] JWT_SECRET: %s...", cfg.JWTSecret[:10])

		token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("неожиданный метод подписи токена: %v", token.Method.Alg())
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil {
			log.Printf("[AUTH ERROR] Ошибка при валидации токена: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный токен: " + err.Error()})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
			log.Printf("[AUTH] Успешная валидация токена, userID: %s", claims.UserID)
			c.Set("userID", claims.UserID)
			c.Next()
		} else {
			log.Printf("[AUTH ERROR] Невалидный токен или claims")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный токен"})
			c.Abort()
			return
		}
	}
}
