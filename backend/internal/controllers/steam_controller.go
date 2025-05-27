package controllers

import (
	"log"
	"net/http"
	"net/url"

	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

// SteamController обрабатывает запросы, связанные с Steam API
type SteamController struct {
	steamService   *services.SteamService
	authController *AuthController
}

// NewSteamController создает новый экземпляр контроллера Steam
func NewSteamController(steamService *services.SteamService, authController *AuthController) *SteamController {
	return &SteamController{
		steamService:   steamService,
		authController: authController,
	}
}

// RegisterRoutes регистрирует маршруты для Steam API
func (c *SteamController) RegisterRoutes(router *gin.RouterGroup) {
	steam := router.Group("/steam")
	{
		steam.GET("/game-info/:steamid/:gamename", c.GetGameInfo)
		steam.GET("/owned-games/:steamid", c.GetOwnedGames)
	}
}

// GetGameInfo получает информацию об игре из Steam для интеграции с Progress
func (c *SteamController) GetGameInfo(ctx *gin.Context) {
	steamID := ctx.Param("steamid")
	gameNameRaw := ctx.Param("gamename")

	// Декодируем URL-кодированное название игры
	gameName, err := url.QueryUnescape(gameNameRaw)
	if err != nil {
		log.Printf("[STEAM CONTROLLER ERROR] Ошибка декодирования названия игры: %v", err)
		gameName = gameNameRaw // используем исходное название как fallback
	}

	log.Printf("[STEAM CONTROLLER] Запрос информации об игре: steamID=%s, gameName='%s' (исходное: '%s')", steamID, gameName, gameNameRaw)

	if steamID == "" || gameName == "" {
		log.Printf("[STEAM CONTROLLER ERROR] Недостаточно параметров: steamID=%s, gameName=%s", steamID, gameName)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Необходимо указать steamid и gamename",
		})
		return
	}

	gameInfo, err := c.steamService.GetGameInfoForProgress(steamID, gameName)
	if err != nil {
		log.Printf("[STEAM CONTROLLER ERROR] Ошибка получения информации об игре: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Ошибка при получении информации об игре из Steam",
			"details": err.Error(),
		})
		return
	}

	if gameInfo == nil {
		log.Printf("[STEAM CONTROLLER] Игра не найдена в Steam библиотеке: %s", gameName)
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Игра не найдена в библиотеке Steam",
		})
		return
	}

	log.Printf("[STEAM CONTROLLER] Успешно получена информация об игре: %+v", gameInfo)
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gameInfo,
	})
}

// GetOwnedGames получает список игр пользователя из Steam
func (c *SteamController) GetOwnedGames(ctx *gin.Context) {
	steamID := ctx.Param("steamid")

	if steamID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Необходимо указать steamid",
		})
		return
	}

	games, err := c.steamService.GetUserOwnedGames(steamID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Ошибка при получении списка игр из Steam",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    games,
		"count":   len(games),
	})
}
