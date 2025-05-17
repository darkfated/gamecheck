package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/google/uuid"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const (
	UserIDKey   = "user_id"
	UserRoleKey = "user_role"
)

// Проверяет JWT из заголовка Authorization
func JWTAuth() gin.HandlerFunc {
	secret := os.Getenv("JWT_SECRET")
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid auth header"})
			return
		}

		token, err := jwt.Parse(parts[1], func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		// Извлекаем ID пользователя из токена
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if sub, ok := claims["sub"].(string); ok {
				userID, err := uuid.Parse(sub)
				if err == nil {
					// Сохраняем ID пользователя в контексте
					c.Set(UserIDKey, userID)
				}
			}

			// Извлекаем роль пользователя из токена
			if role, ok := claims["role"].(string); ok {
				c.Set(UserRoleKey, role)
			}
		}

		c.Next()
	}
}

// GetUserIDFromContext извлекает ID пользователя из контекста Gin
func GetUserIDFromContext(c *gin.Context) (uuid.UUID, bool) {
	userID, exists := c.Get(UserIDKey)
	if !exists {
		return uuid.UUID{}, false
	}

	if id, ok := userID.(uuid.UUID); ok {
		return id, true
	}

	return uuid.UUID{}, false
}

// GetUserRoleFromContext извлекает роль пользователя из контекста Gin
func GetUserRoleFromContext(c *gin.Context) (string, bool) {
	role, exists := c.Get(UserRoleKey)
	if !exists {
		return "", false
	}

	if roleStr, ok := role.(string); ok {
		return roleStr, true
	}

	return "", false
}

// AdminOnly проверяет, что у пользователя есть роль админа
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := GetUserRoleFromContext(c)
		if !exists || role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "admin access required"})
			return
		}
		c.Next()
	}
}
