package handlers

import (
	"net/http"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/middleware"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

type ActivityHandler struct {
	activityService *services.ActivityService
	authService     *services.AuthService
}

func NewActivityHandler(
	activityService *services.ActivityService,
	authService *services.AuthService,
) *ActivityHandler {
	return &ActivityHandler{
		activityService: activityService,
		authService:     authService,
	}
}

func (h *ActivityHandler) RegisterRoutes(router *gin.RouterGroup) {
	activity := router.Group("/activity")
	{
		activity.GET("/all", h.GetAllActivities)
		activity.GET("/feed", middleware.AuthMiddleware(h.authService), h.GetFeed)
		activity.GET("/user/:userId", h.GetUserActivity)
	}
}

func (h *ActivityHandler) GetAllActivities(ctx *gin.Context) {
	activities, err := h.activityService.GetAllActivities(10)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch activities"})
		return
	}

	if activities == nil {
		activities = []*models.Activity{}
	}

	ctx.JSON(http.StatusOK, activities)
}

func (h *ActivityHandler) GetFeed(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	activities, err := h.activityService.GetFeed(userID, 10)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch feed"})
		return
	}

	if activities == nil {
		activities = []*models.Activity{}
	}

	ctx.JSON(http.StatusOK, activities)
}

func (h *ActivityHandler) GetUserActivity(ctx *gin.Context) {
	userID := ctx.Param("userId")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	activities, err := h.activityService.GetUserActivity(userID, 50)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch activity"})
		return
	}

	if activities == nil {
		activities = []*models.Activity{}
	}

	ctx.JSON(http.StatusOK, activities)
}
