package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"gamecheck/internal/config"
	"gamecheck/internal/middleware"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	config       *config.Config
	authService  *services.AuthService
	userService  *services.UserService
	steamService *services.SteamService
}

func NewAuthHandler(
	cfg *config.Config,
	authService *services.AuthService,
	userService *services.UserService,
	steamService *services.SteamService,
) *AuthHandler {
	return &AuthHandler{
		config:       cfg,
		authService:  authService,
		userService:  userService,
		steamService: steamService,
	}
}

func (h *AuthHandler) RegisterRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		auth.GET("/steam", h.SteamLogin)
		auth.GET("/steam/callback", h.SteamCallback)
		auth.GET("/validate-token", h.ValidateToken)
		auth.POST("/logout", middleware.AuthMiddleware(h.authService), h.Logout)
		auth.GET("/current", middleware.AuthMiddleware(h.authService), h.GetCurrent)
		auth.GET("/check", middleware.OptionalAuthMiddleware(h.authService), h.CheckAuth)
	}
}

func (h *AuthHandler) SteamLogin(ctx *gin.Context) {
	steamLoginURL := fmt.Sprintf(
		"https://steamcommunity.com/openid/login?"+
			"openid.ns=http://specs.openid.net/auth/2.0&"+
			"openid.mode=checkid_setup&"+
			"openid.return_to=%s&"+
			"openid.realm=%s&"+
			"openid.identity=http://specs.openid.net/auth/2.0/identifier_select&"+
			"openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select",
		h.config.Steam.RedirectURI,
		"http://localhost:"+h.config.Port,
	)

	ctx.Redirect(http.StatusTemporaryRedirect, steamLoginURL)
}

func (h *AuthHandler) SteamCallback(ctx *gin.Context) {
	claimedID := ctx.Query("openid.claimed_id")
	if claimedID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "missing claimed_id"})
		return
	}

	steamID, err := h.steamService.ExtractSteamID(claimedID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid steam id"})
		return
	}

	log.Printf("[AUTH] Steam callback received. SteamID: %s", steamID)

	token, _, err := h.authService.HandleSteamCallback(steamID)
	if err != nil {
		log.Printf("[AUTH ERROR] Steam callback error: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	redirectURL := fmt.Sprintf("http://localhost:3000/auth/callback?token=%s", token)
	ctx.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

func (h *AuthHandler) ValidateToken(ctx *gin.Context) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")
	if token == authHeader {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header"})
		return
	}

	userID, err := h.authService.ValidateJWT(token)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	user, err := h.userService.GetUser(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AuthHandler) Logout(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	if err := h.authService.Logout(userID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "logout failed"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

func (h *AuthHandler) GetCurrent(ctx *gin.Context) {
	userID, err := middleware.GetUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "not authenticated"})
		return
	}

	user, err := h.userService.GetUserWithStats(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (h *AuthHandler) CheckAuth(ctx *gin.Context) {
	userID, _ := ctx.Get("userID")

	if userID == nil {
		ctx.JSON(http.StatusOK, gin.H{"isAuthenticated": false})
		return
	}

	user, err := h.userService.GetUser(userID.(string))
	if err != nil {
		ctx.JSON(http.StatusOK, gin.H{"isAuthenticated": false})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"isAuthenticated": true,
		"user":            user,
	})
}
