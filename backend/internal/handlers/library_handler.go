package handlers

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"unicode/utf8"

	"gamecheck/internal/middleware"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type LibraryHandler struct {
	libraryService *services.LibraryService
}

func NewLibraryHandler(libraryService *services.LibraryService) *LibraryHandler {
	return &LibraryHandler{
		libraryService: libraryService,
	}
}

func (h *LibraryHandler) RegisterRoutes(router *gin.RouterGroup) {
	library := router.Group("/library")
	{
		library.GET("", h.ListGames)
		library.GET("/suggest", middleware.RateLimitByUserOrIPFromContext("readLimiter"), h.SuggestGames)
		library.GET("/app/:appId", h.GetGameByAppID)
		library.GET("/:id", h.GetGame)
	}
}

func (h *LibraryHandler) ListGames(ctx *gin.Context) {
	var req struct {
		Limit  int    `form:"limit,default=12"`
		Offset int    `form:"offset,default=0"`
		Sort   string `form:"sort,default=createdAt"`
		Order  string `form:"order,default=desc"`
		Search string `form:"search"`
		Genre  string `form:"genre"`
	}

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid query parameters"})
		return
	}

	if req.Limit > 50 {
		req.Limit = 50
	}
	if req.Limit < 1 {
		req.Limit = 12
	}
	if req.Offset < 0 {
		req.Offset = 0
	}

	games, total, err := h.libraryService.ListGames(req.Limit, req.Offset, req.Search, req.Genre, req.Sort, req.Order)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch library games"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":   games,
		"total":  total,
		"limit":  req.Limit,
		"offset": req.Offset,
	})
}

func (h *LibraryHandler) GetGame(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid game id"})
		return
	}

	var req struct {
		Limit  int `form:"limit,default=10"`
		Offset int `form:"offset,default=0"`
	}
	_ = ctx.ShouldBindQuery(&req)
	if req.Limit < 1 {
		req.Limit = 10
	}
	if req.Limit > 10 {
		req.Limit = 10
	}

	game, err := h.libraryService.GetGameByID(id, req.Limit, req.Offset)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "library game not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch library game"})
		return
	}

	ctx.JSON(http.StatusOK, game)
}

func (h *LibraryHandler) GetGameByAppID(ctx *gin.Context) {
	appIDParam := ctx.Param("appId")
	if appIDParam == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid app id"})
		return
	}

	appID, err := strconv.Atoi(appIDParam)
	if err != nil || appID <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid app id"})
		return
	}

	var req struct {
		Limit  int `form:"limit,default=10"`
		Offset int `form:"offset,default=0"`
	}
	_ = ctx.ShouldBindQuery(&req)
	if req.Limit < 1 {
		req.Limit = 10
	}
	if req.Limit > 10 {
		req.Limit = 10
	}

	game, err := h.libraryService.GetGameByAppID(appID, req.Limit, req.Offset)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "library game not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch library game"})
		return
	}

	ctx.JSON(http.StatusOK, game)
}

func (h *LibraryHandler) SuggestGames(ctx *gin.Context) {
	var req struct {
		Query string `form:"query"`
		Limit int    `form:"limit,default=6"`
	}

	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid query parameters"})
		return
	}

	query := strings.TrimSpace(req.Query)
	if utf8.RuneCountInString(query) < 2 {
		ctx.JSON(http.StatusOK, gin.H{
			"source": "none",
			"items":  []services.GameSuggestion{},
		})
		return
	}

	if req.Limit < 1 {
		req.Limit = 6
	}
	if req.Limit > 10 {
		req.Limit = 10
	}

	items, source, err := h.libraryService.SuggestGames(query, req.Limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch suggestions"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"source": source,
		"items":  items,
	})
}
