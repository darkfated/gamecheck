package controllers

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"

	"gamecheck/internal/domain/models"
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

// ActivityCreateRequest представляет запрос на создание активности
type ActivityCreateRequest struct {
	UserID     string              `json:"userId" binding:"required"`
	Type       models.ActivityType `json:"type" binding:"required"`
	ProgressID string              `json:"progressId,omitempty"`
	GameName   string              `json:"gameName,omitempty"`
	Status     string              `json:"status,omitempty"`
	Rating     *int                `json:"rating,omitempty"`
}

// RegisterRoutes регистрирует маршруты для активностей
func (c *ActivityController) RegisterRoutes(router *gin.RouterGroup) {
	activity := router.Group("/activity")
	{
		activity.GET("", c.GetFeed)
		activity.GET("/user/:id", c.GetUserActivity)
		activity.GET("/following", c.AuthRequired(), c.GetFollowingActivity)
		// Специальный эндпоинт для создания активности из микросервиса, не использует AuthRequired
		activity.POST("/create", c.CreateActivity)
	}
}

// CreateActivity создает новую запись активности
func (c *ActivityController) CreateActivity(ctx *gin.Context) {
	var req ActivityCreateRequest

	// Логируем входящие запросы для отладки
	body, _ := ctx.GetRawData()
	log.Printf("[ACTIVITY] Получен запрос на создание активности: %s", string(body))

	// Восстанавливаем тело запроса, так как оно было прочитано ранее
	ctx.Request.Body = io.NopCloser(bytes.NewBuffer(body))

	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Printf("[ACTIVITY ERROR] Ошибка формата запроса: %v", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Неверный формат запроса: %v", err)})
		return
	}

	log.Printf("[ACTIVITY] Расшифрованные данные: %+v", req)

	// Проверка авторизации через токен (опционально)
	userID, exists := ctx.Get("userID")

	// Для межсервисного взаимодействия пропускаем проверку пользователя
	// Доверяем поступающим данным при создании активности
	if exists {
		log.Printf("[ACTIVITY] Запрос от аутентифицированного пользователя: %v", userID)
	} else {
		log.Printf("[ACTIVITY] Запрос без аутентификации, создание межсервисной активности")
	}

	// Создаем активность с данными из запроса
	activity := &models.Activity{
		UserID: req.UserID,
		Type:   req.Type,
	}

	// Заполняем опциональные поля
	if req.ProgressID != "" {
		activity.ProgressID = &req.ProgressID
		log.Printf("[ACTIVITY] Установлен ID прогресса: %s (из микросервиса)", req.ProgressID)
	}

	if req.GameName != "" {
		activity.GameName = &req.GameName
		log.Printf("[ACTIVITY] Установлено название игры: %s", req.GameName)
	}

	if req.Status != "" {
		status := models.GameStatus(req.Status)
		activity.Status = &status
		log.Printf("[ACTIVITY] Установлен статус: %s", req.Status)
	}

	if req.Rating != nil {
		activity.Rating = req.Rating
		log.Printf("[ACTIVITY] Установлен рейтинг: %d", *req.Rating)
	}

	log.Printf("[ACTIVITY] Создаваемая активность: %+v", activity)

	// Создаем активность
	if err := c.activityService.CreateActivity(ctx, activity); err != nil {
		log.Printf("[ACTIVITY ERROR] Ошибка при создании активности: %v", err)

		// Если ошибка связана с внешним ключом, это нормально - таблица Progress теперь в микросервисе
		if strings.Contains(err.Error(), "fk_activities_progress") {
			log.Printf("[ACTIVITY] Игнорируем ошибку внешнего ключа, так как таблица Progress теперь в микросервисе")
			// Создаем активность заново без ссылки на Progress
			activity.ProgressID = nil
			if err := c.activityService.CreateActivity(ctx, activity); err != nil {
				log.Printf("[ACTIVITY ERROR] Повторная ошибка при создании активности: %v", err)
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при создании активности: %v", err)})
				return
			}
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Ошибка при создании активности: %v", err)})
			return
		}
	}

	log.Printf("[ACTIVITY] Активность успешно создана с ID: %s", activity.ID)
	ctx.JSON(http.StatusCreated, gin.H{"message": "Активность успешно создана", "activityId": activity.ID})
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
