package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/darkfated/gamecheck/backend/review-service/model"
	"github.com/darkfated/gamecheck/backend/review-service/service"
	"github.com/darkfated/gamecheck/backend/shared/dto"
	"github.com/darkfated/gamecheck/backend/shared/middleware"
)

func RegisterRoutes(r *gin.Engine, svc *service.ReviewService, auth gin.HandlerFunc) {
	api := r.Group("/v1/games")

	// Создание отзыва (требует аутентификацию)
	authenticatedApi := api.Group("/", auth)
	authenticatedApi.POST("/:game_id/reviews", func(c *gin.Context) {
		var rv model.Review
		if err := c.ShouldBindJSON(&rv); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}

		// Получаем ID пользователя из токена
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "User ID not found in token"})
			return
		}

		// Парсим ID игры из URL
		gameIDStr := c.Param("game_id")
		gameID, err := uuid.Parse(gameIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: "Invalid game ID format"})
			return
		}

		// Устанавливаем ID пользователя и игры
		rv.UserID = userID
		rv.GameID = gameID

		if err := svc.CreateReview(&rv); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusCreated, rv)
	})

	// Обновление отзыва (требует аутентификацию)
	authenticatedApi.PUT("/:game_id/reviews/:review_id", func(c *gin.Context) {
		// Получаем ID пользователя из токена
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "User ID not found in token"})
			return
		}

		// Парсим ID отзыва из URL
		reviewIDStr := c.Param("review_id")
		reviewID, err := uuid.Parse(reviewIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: "Invalid review ID format"})
			return
		}

		// Получаем текущий отзыв для проверки владельца
		currentReview, err := svc.GetByID(reviewID)
		if err != nil {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "Review not found"})
			return
		}

		// Проверяем, что отзыв принадлежит пользователю
		if currentReview.UserID != userID {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: "Not allowed to edit this review"})
			return
		}

		// Получаем данные для обновления
		var updateData struct {
			Rating  int    `json:"rating"`
			Content string `json:"content"`
		}

		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}

		// Обновляем только разрешенные поля
		currentReview.Rating = updateData.Rating
		currentReview.Content = updateData.Content

		if err := svc.UpdateReview(currentReview); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, currentReview)
	})

	// Удаление отзыва (требует аутентификацию)
	authenticatedApi.DELETE("/:game_id/reviews/:review_id", func(c *gin.Context) {
		// Получаем ID пользователя из токена
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "User ID not found in token"})
			return
		}

		// Парсим ID отзыва из URL
		reviewIDStr := c.Param("review_id")
		reviewID, err := uuid.Parse(reviewIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: "Invalid review ID format"})
			return
		}

		// Получаем текущий отзыв для проверки владельца
		currentReview, err := svc.GetByID(reviewID)
		if err != nil {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "Review not found"})
			return
		}

		// Проверяем, что отзыв принадлежит пользователю
		if currentReview.UserID != userID {
			c.JSON(http.StatusForbidden, dto.ErrorResponse{Error: "Not allowed to delete this review"})
			return
		}

		if err := svc.DeleteReview(reviewID); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		c.Status(http.StatusNoContent)
	})

	// Получение всех отзывов текущего пользователя (требует аутентификацию)
	r.GET("/v1/reviews/me", auth, func(c *gin.Context) {
		// Получаем ID пользователя из токена
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "User ID not found in token"})
			return
		}

		reviews, err := svc.GetByUser(userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, reviews)
	})

	// Получение отзывов (публичный доступ)
	api.GET("/:game_id/reviews", func(c *gin.Context) {
		list, err := svc.GetAll(c.Param("game_id"))
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, list)
	})

	// Получение средней оценки из отзывов (для game-service)
	api.GET("/:game_id/ratings", func(c *gin.Context) {
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
