package middleware

import (
	"fmt"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

// ErrorHandler обрабатывает панику в запросах
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Логируем стек вызовов для отладки
				fmt.Printf("Panic recovered: %v\nStack trace: %s\n", err, debug.Stack())

				// Возвращаем 500 ошибку клиенту
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"error": "Internal server error",
				})
			}
		}()

		c.Next()
	}
}
