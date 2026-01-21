package handlers

import (
	"log"
	"net/http"
	"strings"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/middleware"
	"gamecheck/internal/services"
	"gamecheck/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/k0kubun/pp/v3"
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
		progress.POST("", middleware.AuthMiddleware(h.authService), h.AddGame)
		progress.PATCH("/:id", middleware.AuthMiddleware(h.authService), h.UpdateGame)
		progress.DELETE("/:id", middleware.AuthMiddleware(h.authService), h.DeleteGame)
		progress.POST("/:id/update-steam", middleware.AuthMiddleware(h.authService), h.UpdateSteamData)
	}
}

func (h *ProgressHandler) GetUserGames(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	games, err := h.progressService.GetUserGames(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch games"})
		return
	}

	if games == nil {
		games = []*models.Progress{}
	}

	pp.Println(games)

	ctx.JSON(http.StatusOK, games)
}

func (h *ProgressHandler) GetUserGamesByID(ctx *gin.Context) {
	userID := ctx.Param("userId")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	games, err := h.progressService.GetUserGames(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch games"})
		return
	}

	if games == nil {
		games = []*models.Progress{}
	}

	ctx.JSON(http.StatusOK, games)
}

func (h *ProgressHandler) AddGame(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	var req struct {
		Name   string `json:"name" binding:"required"`
		Status string `json:"status" binding:"required"`
		Rating *int   `json:"rating"`
		Review string `json:"review"`
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
	var steamIconURL string
	var steamStoreURL string

	steamGame, err := h.steamService.SearchGameByName(normalizedName)
	if err == nil && steamGame != nil {
		steamAppID = &steamGame.AppID
		steamIconURL = steamGame.Icon
		steamStoreURL = steamGame.StoreURL
	} else if err != nil {
		log.Printf("steam lookup failed for %q: %v", req.Name, err)
	}

	game, err := h.progressService.AddGameWithSteamData(
		userID,
		req.Name,
		req.Status,
		req.Rating,
		req.Review,
		steamAppID,
		steamIconURL,
		steamStoreURL,
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
		SteamIconURL         *string `json:"steamIconUrl"`
		SteamStoreURL        *string `json:"steamStoreUrl"`
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
		req.SteamIconURL,
		req.SteamStoreURL,
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

	updated, err := h.progressService.UpdateSteamData(gameID, nil, "", nil, "")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update steam data"})
		return
	}

	ctx.JSON(http.StatusOK, updated)
}
