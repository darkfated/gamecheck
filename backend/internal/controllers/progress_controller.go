package controllers

import (
	"fmt"
	"net/http"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

// ProgressController обрабатывает запросы, связанные с прогрессом пользователей
type ProgressController struct {
	progressService *services.ProgressService
	authController  *AuthController
}

// NewProgressController создает новый экземпляр контроллера прогресса
func NewProgressController(progressService *services.ProgressService, authController *AuthController) *ProgressController {
	return &ProgressController{
		progressService: progressService,
		authController:  authController,
	}
}

// RegisterRoutes регистрирует маршруты для прогресса
func (c *ProgressController) RegisterRoutes(router *gin.RouterGroup) {
	progress := router.Group("/progress")
	{
		progress.GET("", c.AuthRequired(), c.GetCurrentUserProgress)
		progress.GET("/user/:id", c.GetUserProgress)
		progress.GET("/:id", c.GetProgress)
		progress.POST("", c.AuthRequired(), c.AddProgress)
		progress.PATCH("/:id", c.AuthRequired(), c.UpdateProgress)
		progress.DELETE("/:id", c.AuthRequired(), c.DeleteProgress)
	}
}

// GetCurrentUserProgress возвращает прогресс текущего пользователя
func (c *ProgressController) GetCurrentUserProgress(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	progressItems, err := c.progressService.GetProgressByUserID(ctx, userID.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении прогресса: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, progressItems)
}

// GetUserProgress возвращает прогресс указанного пользователя
func (c *ProgressController) GetUserProgress(ctx *gin.Context) {
	userID := ctx.Param("id")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID пользователя не указан"})
		return
	}

	progressItems, err := c.progressService.GetProgressByUserID(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении прогресса: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, progressItems)
}

// GetProgress возвращает информацию о прогрессе по ID
func (c *ProgressController) GetProgress(ctx *gin.Context) {
	progressID := ctx.Param("id")
	if progressID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID записи прогресса не указан"})
		return
	}

	progress, err := c.progressService.GetProgressByID(ctx, progressID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении прогресса: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, progress)
}

// AddProgress добавляет новую запись прогресса для пользователя
func (c *ProgressController) AddProgress(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	var requestData struct {
		Name   string `json:"name" binding:"required"`
		Status string `json:"status" binding:"required"`
		Rating *int   `json:"rating"`
		Review string `json:"review"`
	}

	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Неверный формат данных: %v", err)})
		return
	}

	status := models.GameStatus(requestData.Status)
	if status != models.StatusPlaying &&
		status != models.StatusCompleted &&
		status != models.StatusPlanToPlay &&
		status != models.StatusDropped {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Неверный статус прогресса: " + requestData.Status})
		return
	}

	progress := &models.Progress{
		UserID: userID.(string),
		Name:   requestData.Name,
		Status: status,
		Rating: requestData.Rating,
		Review: requestData.Review,
	}

	if err := c.progressService.AddProgress(ctx, progress); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при добавлении прогресса: %v", err)})
		return
	}

	ctx.JSON(http.StatusCreated, progress)
}

// UpdateProgress обновляет информацию о прогрессе
func (c *ProgressController) UpdateProgress(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	progressID := ctx.Param("id")
	if progressID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID записи прогресса не указан"})
		return
	}

	var requestData struct {
		Status string `json:"status"`
		Rating *int   `json:"rating"`
		Review string `json:"review"`
	}

	if err := ctx.ShouldBindJSON(&requestData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Неверный формат данных: %v", err)})
		return
	}

	var status models.GameStatus
	if requestData.Status != "" {
		status = models.GameStatus(requestData.Status)
		if status != models.StatusPlaying &&
			status != models.StatusCompleted &&
			status != models.StatusPlanToPlay &&
			status != models.StatusDropped {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Неверный статус прогресса"})
			return
		}
	}

	progress, err := c.progressService.GetProgressByID(ctx, progressID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Запись прогресса не найдена: %v", err)})
		return
	}

	if progress.UserID != userID.(string) {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Нет прав на редактирование этого прогресса"})
		return
	}

	if requestData.Status != "" {
		progress.Status = status
	}
	if requestData.Rating != nil {
		progress.Rating = requestData.Rating
	}
	if requestData.Review != "" {
		progress.Review = requestData.Review
	}

	if err := c.progressService.UpdateProgress(ctx, progress); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при обновлении прогресса: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, progress)
}

// DeleteProgress удаляет запись о прогрессе
func (c *ProgressController) DeleteProgress(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	progressID := ctx.Param("id")
	if progressID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID записи прогресса не указан"})
		return
	}

	if err := c.progressService.DeleteProgress(ctx, progressID, userID.(string)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при удалении прогресса: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Прогресс успешно удален"})
}

// AuthRequired использует AuthMiddleware из AuthController для проверки аутентификации
func (c *ProgressController) AuthRequired() gin.HandlerFunc {
	return c.authController.AuthMiddleware()
}
