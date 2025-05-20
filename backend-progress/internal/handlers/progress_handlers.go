package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"log"

	"github.com/gamecheck/progress-service/internal/domain/models"
	"github.com/gamecheck/progress-service/internal/service"
	"github.com/gin-gonic/gin"
)

// ActivityType представляет тип активности пользователя
type ActivityType string

const (
	ActivityTypeAddGame      ActivityType = "add_game"
	ActivityTypeUpdateStatus ActivityType = "update_status"
	ActivityTypeUpdateGame   ActivityType = "update_game"
	ActivityTypeRateGame     ActivityType = "rate_game"
)

// ActivityNotification структура для отправки уведомления об активности
type ActivityNotification struct {
	UserID     string       `json:"userId"`
	Type       ActivityType `json:"type"`
	ProgressID string       `json:"progressId,omitempty"`
	GameName   string       `json:"gameName,omitempty"`
	Status     string       `json:"status,omitempty"`
	Rating     *int         `json:"rating,omitempty"`
}

// ProgressHandlers содержит обработчики для API прогресса
type ProgressHandlers struct {
	service        *service.ProgressService
	mainServiceURL string
}

// NewProgressHandlers создает новые обработчики прогресса
func NewProgressHandlers(service *service.ProgressService) *ProgressHandlers {
	mainServiceURL := os.Getenv("USER_SERVICE_URL")
	if mainServiceURL == "" {
		mainServiceURL = "http://localhost:5000"
		log.Printf("[PROGRESS] Используется URL основного сервиса по умолчанию: %s", mainServiceURL)
	}

	log.Printf("[PROGRESS] Настроен URL основного сервиса: %s", mainServiceURL)

	return &ProgressHandlers{
		service:        service,
		mainServiceURL: mainServiceURL,
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// notifyMainService отправляет уведомление об активности в основной сервис
func (h *ProgressHandlers) notifyMainService(notification ActivityNotification, token string) {
	url := fmt.Sprintf("%s/api/activity/create", h.mainServiceURL)

	log.Printf("[PROGRESS] Отправка уведомления об активности в основной сервис: %+v", notification)
	log.Printf("[PROGRESS] URL основного сервиса: %s", url)

	if token == "" {
		log.Printf("[PROGRESS ERROR] Токен авторизации отсутствует, пытаемся продолжить без токена")
	}

	jsonData, err := json.Marshal(notification)
	if err != nil {
		log.Printf("[PROGRESS ERROR] Ошибка при сериализации уведомления: %v", err)
		return
	}

	log.Printf("[PROGRESS] Сериализованные данные уведомления: %s", string(jsonData))

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("[PROGRESS ERROR] Ошибка при создании запроса уведомления: %v", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	}
	req.Header.Set("Origin", "http://localhost:5001")
	req.Header.Set("Accept", "application/json")

	headersCopy := make(map[string][]string)
	for k, v := range req.Header {
		headersCopy[k] = v
	}

	if authHeaders, ok := headersCopy["Authorization"]; ok && len(authHeaders) > 0 {
		if len(authHeaders[0]) > 15 {
			headersCopy["Authorization"] = []string{authHeaders[0][:15] + "..."}
		}
	}

	log.Printf("[PROGRESS] Все заголовки запроса: %+v", headersCopy)

	client := &http.Client{
		Timeout: time.Second * 10,
	}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[PROGRESS ERROR] Ошибка при отправке уведомления в основной сервис: %v", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	log.Printf("[PROGRESS] Код ответа: %d", resp.StatusCode)

	if resp.StatusCode >= 400 {
		log.Printf("[PROGRESS ERROR] Основной сервис вернул ошибку %d: %s", resp.StatusCode, string(body))
		return
	}

	log.Printf("[PROGRESS] Уведомление об активности успешно отправлено в основной сервис. Ответ: %s", string(body))
}

// CreateProgress обрабатывает запрос на создание нового прогресса
func (h *ProgressHandlers) CreateProgress(c *gin.Context) {
	var progress models.Progress

	userID, exists := c.Get("userID")
	if !exists {
		log.Printf("[PROGRESS ERROR] ID пользователя отсутствует в контексте")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "пользователь не аутентифицирован"})
		return
	}

	log.Printf("[PROGRESS] Получен ID пользователя: %v (тип: %T)", userID, userID)

	userIDStr, ok := userID.(string)
	if !ok {
		log.Printf("[PROGRESS ERROR] ID пользователя не является строкой: %v (тип: %T)", userID, userID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "некорректный ID пользователя"})
		return
	}

	progress.UserID = userIDStr

	if err := c.ShouldBindJSON(&progress); err != nil {
		log.Printf("[PROGRESS ERROR] Ошибка привязки JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	log.Printf("[PROGRESS] Создание прогресса для пользователя %s: %+v", userIDStr, progress)

	if err := h.service.CreateProgress(c.Request.Context(), &progress); err != nil {
		log.Printf("[PROGRESS ERROR] Ошибка создания прогресса: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	authHeader := c.GetHeader("Authorization")
	token := ""
	if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
		token = authHeader[7:]
	}

	notification := ActivityNotification{
		UserID:     userIDStr,
		Type:       ActivityTypeAddGame,
		ProgressID: progress.ID,
		GameName:   progress.Name,
		Status:     string(progress.Status),
	}
	go h.notifyMainService(notification, token)

	log.Printf("[PROGRESS] Прогресс успешно создан: %s", progress.ID)
	c.JSON(http.StatusCreated, progress)
}

// GetProgress обрабатывает запрос на получение прогресса по ID
func (h *ProgressHandlers) GetProgress(c *gin.Context) {
	progressID := c.Param("id")
	if progressID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID прогресса не указан"})
		return
	}

	progress, err := h.service.GetProgressByID(c.Request.Context(), progressID)
	if err != nil {
		if err == service.ErrProgressNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "прогресс не найден"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, progress)
}

// GetUserProgress обрабатывает запрос на получение прогресса пользователя
func (h *ProgressHandlers) GetUserProgress(c *gin.Context) {
	paramUserID := c.Param("id")

	if paramUserID == "" {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "пользователь не аутентифицирован"})
			return
		}
		paramUserID = userID.(string)
	}

	progress, err := h.service.GetUserProgress(c.Request.Context(), paramUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, progress)
}

// UpdateProgress обрабатывает запрос на обновление прогресса
func (h *ProgressHandlers) UpdateProgress(c *gin.Context) {
	progressID := c.Param("id")
	if progressID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID прогресса не указан"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "пользователь не аутентифицирован"})
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "некорректный ID пользователя"})
		return
	}

	oldProgress, err := h.service.GetProgressByID(c.Request.Context(), progressID)
	if err != nil {
		if err == service.ErrProgressNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "прогресс не найден"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	if oldProgress.UserID != userIDStr {
		c.JSON(http.StatusForbidden, gin.H{"error": "у вас нет прав на обновление этого прогресса"})
		return
	}

	var progress models.Progress
	if err := c.ShouldBindJSON(&progress); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	progress.ID = progressID
	progress.UserID = userIDStr

	if err := h.service.UpdateProgress(c.Request.Context(), &progress); err != nil {
		log.Printf("[PROGRESS ERROR] Ошибка при обновлении прогресса: %v", err)
		if err == service.ErrProgressNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "прогресс не найден"})
		} else if err == service.ErrUnauthorized {
			c.JSON(http.StatusForbidden, gin.H{"error": "у вас нет прав на обновление этого прогресса"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Получаем токен из заголовка
	authHeader := c.GetHeader("Authorization")
	token := ""
	if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
		token = authHeader[7:]
	}

	activityType := ActivityTypeUpdateGame

	if progress.Status != "" && progress.Status != oldProgress.Status {
		activityType = ActivityTypeUpdateStatus
	}

	if progress.Rating != nil && (oldProgress.Rating == nil || *progress.Rating != *oldProgress.Rating) {
		activityType = ActivityTypeRateGame
	}

	notification := ActivityNotification{
		UserID:     userIDStr,
		Type:       activityType,
		ProgressID: progress.ID,
		GameName:   oldProgress.Name,
		Status:     string(progress.Status),
		Rating:     progress.Rating,
	}
	go h.notifyMainService(notification, token)

	log.Printf("[PROGRESS] Прогресс %s успешно обновлен", progressID)
	c.JSON(http.StatusOK, gin.H{"message": "прогресс успешно обновлен"})
}

// DeleteProgress обрабатывает запрос на удаление прогресса
func (h *ProgressHandlers) DeleteProgress(c *gin.Context) {
	progressID := c.Param("id")
	if progressID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID прогресса не указан"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "пользователь не аутентифицирован"})
		return
	}

	_, err := h.service.GetProgressByID(c.Request.Context(), progressID)
	if err != nil {
		if err == service.ErrProgressNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "прогресс не найден"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	if err := h.service.DeleteProgress(c.Request.Context(), progressID, userID.(string)); err != nil {
		if err == service.ErrProgressNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "прогресс не найден"})
		} else if err == service.ErrUnauthorized {
			c.JSON(http.StatusForbidden, gin.H{"error": "у вас нет прав на удаление этого прогресса"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// В будущем, если необходимо, здесь добавить уведомление об удалении игры

	c.JSON(http.StatusOK, gin.H{"message": "прогресс успешно удален"})
}

// ListProgress обрабатывает запрос на получение списка прогресса с пагинацией
func (h *ProgressHandlers) ListProgress(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	filters := make(map[string]interface{})

	if status := c.Query("status"); status != "" {
		filters["status"] = status
	}

	progress, total, err := h.service.ListProgress(c.Request.Context(), page, pageSize, filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": progress,
		"meta": gin.H{
			"page":     page,
			"pageSize": pageSize,
			"total":    total,
			"pages":    (total + int64(pageSize) - 1) / int64(pageSize),
		},
	})
}
