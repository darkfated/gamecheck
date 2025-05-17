package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/darkfated/gamecheck/backend/progress-service/model"
	"github.com/darkfated/gamecheck/backend/progress-service/service"
	"github.com/darkfated/gamecheck/backend/shared/dto"
	"github.com/darkfated/gamecheck/backend/shared/middleware"
)

func RegisterRoutes(r *gin.Engine, svc *service.ProgressService, auth gin.HandlerFunc) {
	api := r.Group("/v1/users", auth)

	// Добавление/обновление статуса игры текущего пользователя
	api.POST("/me/games", func(c *gin.Context) {
		var ug model.UserGame
		if err := c.ShouldBindJSON(&ug); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}

		// Получаем ID пользователя из токена
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "User ID not found in token"})
			return
		}

		ug.UserID = userID

		if err := svc.UpsertProgress(&ug); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, ug)
	})

	// Получение статусов игр текущего пользователя
	api.GET("/me/games", func(c *gin.Context) {
		// Получаем ID пользователя из токена
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "User ID not found in token"})
			return
		}

		list, err := svc.GetUserProgress(userID.String())
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, list)
	})

	// Удаление статуса игры текущего пользователя
	api.DELETE("/me/games/:game_id", func(c *gin.Context) {
		// Получаем ID пользователя из токена
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "User ID not found in token"})
			return
		}

		// Получаем ID игры из URL
		gameIDStr := c.Param("game_id")
		gameID, err := uuid.Parse(gameIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: "Invalid game ID format"})
			return
		}

		if err := svc.DeleteProgress(userID, gameID); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		c.Status(http.StatusNoContent)
	})

	// Для совместимости со старыми эндпоинтами оставляем поддержку явного указания user_id
	api.POST("/:user_id/games", func(c *gin.Context) {
		var ug model.UserGame
		if err := c.ShouldBindJSON(&ug); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}
		if err := svc.UpsertProgress(&ug); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, ug)
	})

	api.GET("/:user_id/games", func(c *gin.Context) {
		list, err := svc.GetUserProgress(c.Param("user_id"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, list)
	})

	// Маршрут для получения средней оценки игры
	gamesAPI := r.Group("/v1/games")
	gamesAPI.GET("/:game_id/ratings", func(c *gin.Context) {
		gameID := c.Param("game_id")

		// Проверяем валидность UUID
		_, err := uuid.Parse(gameID)
		if err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: "Invalid game ID format"})
			return
		}

		avgRating, count, err := svc.GetGameRating(gameID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"game_id":    gameID,
			"avg_rating": avgRating,
			"count":      count,
		})
	})
}
