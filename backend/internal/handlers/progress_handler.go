package handlers

import (
	"log"
	"net/http"
	"strings"

	"gamecheck/internal/middleware"
	"gamecheck/internal/services"
	"gamecheck/pkg/utils"

	"github.com/gin-gonic/gin"
)

type ProgressHandler struct {
	progressService *services.ProgressService
	authService     *services.AuthService
	steamService    *services.SteamService
}

func NewProgressHandler(
	progressService *services.ProgressService,
	authService *services.AuthService,
	steamService *services.SteamService,
) *ProgressHandler {
	return &ProgressHandler{
		progressService: progressService,
		authService:     authService,
		steamService:    steamService,
	}
}

func (h *ProgressHandler) RegisterRoutes(router *gin.RouterGroup) {
	progress := router.Group("/progress")
	{
		progress.GET("", middleware.AuthMiddleware(h.authService), h.GetUserGames)
		progress.GET("/user/:userId", h.GetUserGamesByID)
		progress.POST("", middleware.AuthMiddleware(h.authService), middleware.RateLimitByUserOrIPFromContext("gameAddUpdateLimiter"), h.AddGame)
		progress.PATCH("/:id", middleware.AuthMiddleware(h.authService), middleware.RateLimitByUserOrIPFromContext("gameAddUpdateLimiter"), h.UpdateGame)
		progress.DELETE("/:id", middleware.AuthMiddleware(h.authService), middleware.RateLimitByUserOrIPFromContext("deleteLimiter"), h.DeleteGame)
		progress.POST("/:id/update-steam", middleware.AuthMiddleware(h.authService), middleware.RateLimitByUserOrIPFromContext("gameAddUpdateLimiter"), h.UpdateSteamData)
	}
}

func (h *ProgressHandler) GetUserGames(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	req := getProgressListQuery(ctx)
	page, err := h.progressService.GetUserGamesPage(userID, req.Status, req.Limit, req.Offset, req.Summary)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch games"})
		return
	}

	if page.Data == nil {
		page.Data = []*services.ProgressGameResponse{}
	}

	ctx.JSON(http.StatusOK, page)
}

func (h *ProgressHandler) GetUserGamesByID(ctx *gin.Context) {
	userID := ctx.Param("userId")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	req := getProgressListQuery(ctx)
	page, err := h.progressService.GetUserGamesPage(userID, req.Status, req.Limit, req.Offset, req.Summary)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch games"})
		return
	}

	if page.Data == nil {
		page.Data = []*services.ProgressGameResponse{}
	}

	ctx.JSON(http.StatusOK, page)
}

func (h *ProgressHandler) AddGame(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	var req struct {
		Name       string `json:"name" binding:"required"`
		Status     string `json:"status" binding:"required"`
		Rating     *int   `json:"rating"`
		Review     string `json:"review"`
		SteamAppID *int   `json:"steamAppId"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	normalizedName := strings.ReplaceAll(strings.TrimSpace(req.Name), "’", "'")

	if err := utils.ValidateGameName(normalizedName); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Rating != nil {
		if err := utils.ValidateRating(*req.Rating); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	if err := utils.ValidateReview(req.Review); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var steamAppID *int
	var playtimeForever *int

	if req.SteamAppID != nil {
		if *req.SteamAppID <= 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid steam app id"})
			return
		}
		steamAppID = req.SteamAppID
	} else {
		steamGame, err := h.steamService.SearchGameByName(normalizedName)
		if err == nil && steamGame != nil {
			steamAppID = &steamGame.AppID
			if strings.TrimSpace(steamGame.Name) != "" {
				normalizedName = strings.TrimSpace(steamGame.Name)
			}
		} else if err != nil {
			log.Printf("steam lookup failed for %q: %v", req.Name, err)
		}
	}

	if steamAppID != nil {
		user, err := h.authService.GetUserByID(userID)
		if err == nil && user != nil && user.SteamID != "" {
			playtime, err := h.steamService.GetGamePlaytime(user.SteamID, *steamAppID)
			if err == nil {
				playtimeForever = &playtime
			} else {
				log.Printf("failed to fetch playtime for app %d: %v", *steamAppID, err)
			}
		}
	}

	exists, err := h.progressService.ExistsForUser(userID, steamAppID, normalizedName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check existing games"})
		return
	}
	if exists {
		ctx.JSON(http.StatusConflict, gin.H{"error": "game already exists in your library"})
		return
	}

	game, err := h.progressService.AddGameWithSteamData(
		userID,
		normalizedName,
		req.Status,
		req.Rating,
		req.Review,
		steamAppID,
		playtimeForever,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add game"})
		return
	}

	ctx.JSON(http.StatusCreated, game)
}

func (h *ProgressHandler) UpdateGame(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	gameID := ctx.Param("id")
	if gameID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid game id"})
		return
	}

	game, err := h.progressService.GetGameByID(gameID)
	log.Println(game)
	if err != nil || game.UserID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "unauthorized"})
		return
	}

	var req struct {
		Name                 *string `json:"name"`
		Status               *string `json:"status"`
		Rating               *int    `json:"rating"`
		Review               *string `json:"review"`
		SteamAppID           *int    `json:"steamAppId"`
		SteamPlaytimeForever *int    `json:"steamPlaytimeForever"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	if req.Name != nil {
		if err := utils.ValidateGameName(*req.Name); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	if req.Rating != nil {
		if err := utils.ValidateRating(*req.Rating); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	if req.Review != nil {
		if err := utils.ValidateReview(*req.Review); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	if req.SteamAppID != nil {
		user, err := h.authService.GetUserByID(userID)
		if err == nil && user != nil && user.SteamID != "" {
			playtime, err := h.steamService.GetGamePlaytime(user.SteamID, *req.SteamAppID)
			if err == nil {
				req.SteamPlaytimeForever = &playtime
			}
		}
	}

	updated, err := h.progressService.UpdateGame(
		gameID,
		req.Name,
		req.Status,
		req.Rating,
		req.Review,
		req.SteamAppID,
		req.SteamPlaytimeForever,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update game"})
		return
	}

	ctx.JSON(http.StatusOK, updated)
}

func (h *ProgressHandler) DeleteGame(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	gameID := ctx.Param("id")
	if gameID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid game id"})
		return
	}

	game, err := h.progressService.GetGameByID(gameID)
	if err != nil || game.UserID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.progressService.DeleteGame(gameID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete game"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "game deleted"})
}

func (h *ProgressHandler) UpdateSteamData(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	gameID := ctx.Param("id")
	if gameID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid game id"})
		return
	}

	game, err := h.progressService.GetGameByID(gameID)
	if err != nil || game.UserID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "unauthorized"})
		return
	}

	user, err := h.authService.GetUserByID(userID)
	if err != nil || user == nil || user.SteamID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "steam account not connected"})
		return
	}

	var playtimeForever *int
	if game.SteamAppID != nil {
		playtime, err := h.steamService.GetGamePlaytime(user.SteamID, *game.SteamAppID)
		if err == nil {
			playtimeForever = &playtime
		} else {
			log.Printf("failed to fetch playtime for app %d: %v", *game.SteamAppID, err)
		}
	}

	updated, err := h.progressService.UpdateSteamData(gameID, game.SteamAppID, playtimeForever)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update steam data"})
		return
	}

	ctx.JSON(http.StatusOK, updated)
}

type progressListQuery struct {
	Limit   int    `form:"limit,default=30"`
	Offset  int    `form:"offset,default=0"`
	Status  string `form:"status"`
	Summary bool   `form:"summary"`
}

func getProgressListQuery(ctx *gin.Context) progressListQuery {
	var req progressListQuery
	if err := ctx.ShouldBindQuery(&req); err != nil {
		req.Limit = 30
		req.Offset = 0
	}

	if req.Limit > 50 {
		req.Limit = 50
	}
	if req.Limit < 0 {
		req.Limit = 0
	}
	if req.Offset < 0 {
		req.Offset = 0
	}

	if strings.EqualFold(req.Status, "all") {
		req.Status = ""
	}

	return req
}
