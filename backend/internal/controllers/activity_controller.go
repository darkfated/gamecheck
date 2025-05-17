package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

// ActivityController обрабатывает запросы, связанные с активностями пользователей
type ActivityController struct {
	activityService *services.ActivityService
	authController  *AuthController
}

// NewActivityController создает новый экземпляр контроллера активностей
func NewActivityController(activityService *services.ActivityService, authController *AuthController) *ActivityController {
	return &ActivityController{
		activityService: activityService,
		authController:  authController,
	}
}

// RegisterRoutes регистрирует маршруты для активностей
func (c *ActivityController) RegisterRoutes(router *gin.RouterGroup) {
	activity := router.Group("/activity")
	{
		activity.GET("", c.GetFeed)
		activity.GET("/user/:id", c.GetUserActivity)
		activity.GET("/following", c.AuthRequired(), c.GetFollowingActivity)
	}
}

// GetFeed возвращает общую ленту активности
func (c *ActivityController) GetFeed(ctx *gin.Context) {
	limit, offset := c.getPaginationParams(ctx)

	activities, err := c.activityService.GetFeed(ctx, limit, offset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении ленты активности: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, activities)
}

// GetUserActivity возвращает активность конкретного пользователя
func (c *ActivityController) GetUserActivity(ctx *gin.Context) {
	// Получаем ID пользователя
	userID := ctx.Param("id")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID пользователя не указан"})
		return
	}

	limit, offset := c.getPaginationParams(ctx)

	activities, err := c.activityService.GetUserActivity(ctx, userID, limit, offset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении активности пользователя: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, activities)
}

// GetFollowingActivity возвращает активность пользователей, на которых подписан текущий пользователь
func (c *ActivityController) GetFollowingActivity(ctx *gin.Context) {
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не аутентифицирован"})
		return
	}

	limit, offset := c.getPaginationParams(ctx)

	activities, err := c.activityService.GetFollowingActivity(ctx, userID.(string), limit, offset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при получении активности подписок: %v", err)})
		return
	}

	ctx.JSON(http.StatusOK, activities)
}

// getPaginationParams получает параметры пагинации из запроса
func (c *ActivityController) getPaginationParams(ctx *gin.Context) (int, int) {
	limit := 20
	offset := 0

	limitStr := ctx.DefaultQuery("limit", "20")
	if limitVal, err := strconv.Atoi(limitStr); err == nil && limitVal > 0 {
		limit = limitVal
		if limit > 100 {
			limit = 100 // Максимальный лимит
		}
	}

	offsetStr := ctx.DefaultQuery("offset", "0")
	if offsetVal, err := strconv.Atoi(offsetStr); err == nil && offsetVal >= 0 {
		offset = offsetVal
	}

	return limit, offset
}

// AuthRequired использует AuthMiddleware из AuthController для проверки аутентификации
func (c *ActivityController) AuthRequired() gin.HandlerFunc {
	return c.authController.AuthMiddleware()
}
