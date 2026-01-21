package handlers

import (
	"net/http"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"
	"gamecheck/internal/middleware"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SubscriptionHandler struct {
	subscriptionRepository *repositories.SubscriptionRepository
	activityService        *services.ActivityService
	authService            *services.AuthService
}

func NewSubscriptionHandler(
	subscriptionRepo *repositories.SubscriptionRepository,
	activityService *services.ActivityService,
	authService *services.AuthService,
) *SubscriptionHandler {
	return &SubscriptionHandler{
		subscriptionRepository: subscriptionRepo,
		activityService:        activityService,
		authService:            authService,
	}
}

func (h *SubscriptionHandler) RegisterRoutes(router *gin.RouterGroup) {
	subs := router.Group("/subscriptions")
	{
		subs.GET("/:userId/followers", h.GetFollowers)
		subs.GET("/:userId/following", h.GetFollowing)
		subs.POST("/follow/:userId", middleware.AuthMiddleware(h.authService), h.Follow)
		subs.DELETE("/unfollow/:userId", middleware.AuthMiddleware(h.authService), h.Unfollow)
	}
}

func (h *SubscriptionHandler) GetFollowers(ctx *gin.Context) {
	userID := ctx.Param("userId")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	followers, err := h.subscriptionRepository.GetFollowers(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch followers"})
		return
	}

	if followers == nil {
		followers = []*models.User{}
	}

	ctx.JSON(http.StatusOK, followers)
}

func (h *SubscriptionHandler) GetFollowing(ctx *gin.Context) {
	userID := ctx.Param("userId")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	following, err := h.subscriptionRepository.GetFollowing(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch following"})
		return
	}

	if following == nil {
		following = []*models.User{}
	}

	ctx.JSON(http.StatusOK, following)
}

func (h *SubscriptionHandler) Follow(ctx *gin.Context) {
	followerID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	followingID := ctx.Param("userId")
	if followingID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	if followerID == followingID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "cannot follow yourself"})
		return
	}

	isFollowing, _ := h.subscriptionRepository.IsFollowing(followerID, followingID)
	if isFollowing {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "already following"})
		return
	}

	sub := &models.Subscription{
		ID:          uuid.New().String(),
		FollowerID:  followerID,
		FollowingID: followingID,
	}

	if err := h.subscriptionRepository.Create(sub); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to follow user"})
		return
	}

	h.activityService.Follow(followerID, followingID)

	ctx.JSON(http.StatusOK, gin.H{"message": "followed"})
}

func (h *SubscriptionHandler) Unfollow(ctx *gin.Context) {
	followerID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	followingID := ctx.Param("userId")
	if followingID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	if err := h.subscriptionRepository.DeleteByUsers(followerID, followingID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unfollow user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "unfollowed"})
}
