package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// NotFoundHandler обрабатывает запросы к несуществующим маршрутам
func NotFoundHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Endpoint not found",
			"path":  c.Request.URL.Path,
		})
	}
}
