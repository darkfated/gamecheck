package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

// RequestLogger логирует информацию о запросах
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Время начала запроса
		startTime := time.Now()

		// Обработка запроса
		c.Next()

		// Время завершения запроса
		endTime := time.Now()

		// Расчёт времени выполнения
		latencyTime := endTime.Sub(startTime)

		// Получение информации о запросе
		fmt.Printf("[%s] %s | %d | %s | %s | %s\n",
			startTime.Format("2006-01-02 15:04:05"),
			c.Request.Method,
			c.Writer.Status(),
			latencyTime,
			c.ClientIP(),
			c.Request.RequestURI,
		)
	}
}
