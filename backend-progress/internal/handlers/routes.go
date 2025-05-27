package handlers

import (
	"github.com/gamecheck/progress-service/internal/config"
	"github.com/gin-gonic/gin"
)

// Router настраивает все маршруты API
type Router struct {
	cfg              *config.Config
	progressHandlers *ProgressHandlers
}

func NewRouter(cfg *config.Config, progressHandlers *ProgressHandlers) *Router {
	return &Router{
		cfg:              cfg,
		progressHandlers: progressHandlers,
	}
}

func (r *Router) SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")

	api.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "progress-service",
		})
	})

	protected := api.Group("")
	protected.Use(AuthMiddleware(r.cfg))

	progress := protected.Group("/progress")
	{
		progress.POST("", r.progressHandlers.CreateProgress)
		progress.GET("/:id", r.progressHandlers.GetProgress)
		progress.GET("", r.progressHandlers.GetUserProgress)
		progress.PUT("/:id", r.progressHandlers.UpdateProgress)
		progress.PATCH("/:id", r.progressHandlers.UpdateProgress)
		progress.DELETE("/:id", r.progressHandlers.DeleteProgress)
		progress.GET("/list", r.progressHandlers.ListProgress)
		progress.GET("/user/:id", r.progressHandlers.GetUserProgress)
		progress.POST("/:id/update-steam", r.progressHandlers.UpdateSteamData)
	}
}
