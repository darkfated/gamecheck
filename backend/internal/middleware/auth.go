package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
			ctx.Abort()
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == authHeader {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header"})
			ctx.Abort()
			return
		}

		userID, err := authService.ValidateJWT(token)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			ctx.Abort()
			return
		}

		ctx.Set("userID", userID)
		ctx.Next()
	}
}

func OptionalAuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader != "" {
			token := strings.TrimPrefix(authHeader, "Bearer ")
			if token != authHeader {
				userID, err := authService.ValidateJWT(token)
				if err == nil {
					ctx.Set("userID", userID)
				}
			}
		}
		ctx.Next()
	}
}

func ErrorHandler() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		ctx.Next()

		if len(ctx.Errors) > 0 {
			err := ctx.Errors.Last()
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("internal server error: %v", err),
			})
		}
	}
}

func GetUserID(ctx *gin.Context) (string, error) {
	userID, exists := ctx.Get("userID")
	if !exists {
		return "", fmt.Errorf("user not authenticated")
	}

	id, ok := userID.(string)
	if !ok {
		return "", fmt.Errorf("invalid user id type")
	}

	return id, nil
}
