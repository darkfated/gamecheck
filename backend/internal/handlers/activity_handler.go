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
		activity.GET("/all", middleware.RateLimitByUserOrIPFromContext("readLimiter"), h.GetAllActivities)
		activity.GET("/feed", middleware.AuthMiddleware(h.authService), middleware.RateLimitByUserOrIPFromContext("readLimiter"), h.GetFeed)
		activity.GET("/user/:userId", middleware.RateLimitByUserOrIPFromContext("readLimiter"), h.GetUserActivity)
	}
}

func (h *ActivityHandler) GetAllActivities(ctx *gin.Context) {
	limit, offset := getPagination(ctx)
	activities, err := h.activityService.GetAllActivities(limit, offset)
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

	limit, offset := getPagination(ctx)
	activities, err := h.activityService.GetFeed(userID, limit, offset)
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

	limit, offset := getPagination(ctx)
	activities, err := h.activityService.GetUserActivity(userID, limit, offset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch activity"})
		return
	}

	if activities == nil {
		activities = []*models.Activity{}
	}

	ctx.JSON(http.StatusOK, activities)
}

func getPagination(ctx *gin.Context) (int, int) {
	var req struct {
		Limit  int `form:"limit,default=10"`
		Offset int `form:"offset,default=0"`
	}

	if err := ctx.ShouldBindQuery(&req); err != nil {
		return 10, 0
	}

	if req.Limit > 50 {
		req.Limit = 50
	}
	if req.Limit < 1 {
		req.Limit = 10
	}
	if req.Offset < 0 {
		req.Offset = 0
	}

	return req.Limit, req.Offset
}
