package handlers

import (
	"net/http"
	"regexp"
	"strings"

	"gamecheck/internal/middleware"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *services.UserService
	authService *services.AuthService
}

func NewUserHandler(
	userService *services.UserService,
	authService *services.AuthService,
) *UserHandler {
	return &UserHandler{
		userService: userService,
		authService: authService,
	}
}

func (h *UserHandler) RegisterRoutes(router *gin.RouterGroup) {
	users := router.Group("/users")
	{
		users.GET("", h.ListUsers)
		users.GET("/:id", middleware.OptionalAuthMiddleware(h.authService), h.GetProfile)
		users.PATCH("/profile", middleware.AuthMiddleware(h.authService), middleware.RateLimitByUserOrIPFromContext("gameAddUpdateLimiter"), h.UpdateProfile)
		users.GET("/search/:query", h.SearchUsers)
	}
}

func (h *UserHandler) GetProfile(ctx *gin.Context) {
	userID := ctx.Param("id")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	currentUserID, _ := ctx.Get("userID")
	currentID := ""
	if currentUserID != nil {
		currentID = currentUserID.(string)
	}

	user, err := h.userService.GetUserProfile(userID, currentID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (h *UserHandler) ListUsers(ctx *gin.Context) {
	var req struct {
		Limit  int    `form:"limit,default=10"`
		Offset int    `form:"offset,default=0"`
		Sort   string `form:"sort,default=createdAt"`
		Order  string `form:"order,default=desc"`
	}

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid query parameters"})
		return
	}

	if req.Limit > 50 {
		req.Limit = 50
	}
	if req.Limit < 1 {
		req.Limit = 10
	}

	users, total, err := h.userService.ListUsers(req.Limit, req.Offset, req.Sort, req.Order)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":   users,
		"total":  total,
		"limit":  req.Limit,
		"offset": req.Offset,
	})
}

func (h *UserHandler) UpdateProfile(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	var req struct {
		DisplayName *string `json:"displayName"`
		DiscordTag  *string `json:"discordTag"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	if req.DiscordTag != nil && *req.DiscordTag != "" {
		discordTag := strings.TrimSpace(*req.DiscordTag)
		if len(discordTag) < 4 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "discord tag must be at least 4 characters"})
			return
		}
		if len(discordTag) > 20 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "discord tag must be at most 20 characters"})
			return
		}
		if !regexp.MustCompile(`^[a-z0-9]+$`).MatchString(discordTag) {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "discord tag can only contain lowercase letters (a-z) and digits (0-9)"})
			return
		}
		req.DiscordTag = &discordTag
	}

	user, err := h.userService.GetUser(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if req.DisplayName != nil {
		user.DisplayName = *req.DisplayName
	}
	if req.DiscordTag != nil {
		user.DiscordTag = *req.DiscordTag
	}

	if err := h.userService.UpdateUser(user); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (h *UserHandler) SearchUsers(ctx *gin.Context) {
	query := ctx.Param("query")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "query is required"})
		return
	}

	users, err := h.userService.SearchUsers(query, 10)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "search failed"})
		return
	}

	ctx.JSON(http.StatusOK, users)
}
