package app

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"gamecheck/internal/config"
	"gamecheck/internal/handlers"
	"gamecheck/internal/infra/db"
	"gamecheck/internal/middleware"
	"gamecheck/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type App struct {
	config   *config.Config
	router   *gin.Engine
	database *db.Database
	handlers *handlers.Handlers
	services *services.Services
	server   *http.Server
}

func New(cfg *config.Config) (*App, error) {
	database, err := db.New(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}

	repos := db.NewRepositories(database)

	authService := services.NewAuthService(
		cfg,
		repos.User,
		repos.Token,
		repos.Activity,
	)

	userService := services.NewUserService(
		repos.User,
		repos.Subscription,
		repos.Activity,
	)

	steamService := services.NewSteamService(cfg)

	progressService := services.NewProgressService(
		repos.Progress,
		repos.Activity,
		steamService,
	)

	activityService := services.NewActivityService(
		repos.Activity,
		repos.User,
	)

	svcs := services.New(
		authService,
		userService,
		progressService,
		activityService,
		steamService,
	)

	hdlrs := handlers.New(cfg, svcs, repos.Repository)

	router := setupRouter(cfg, hdlrs)

	app := &App{
		config:   cfg,
		router:   router,
		database: database,
		handlers: hdlrs,
		services: svcs,
	}

	return app, nil
}

func setupRouter(cfg *config.Config, hdlrs *handlers.Handlers) *gin.Engine {
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	corsConfig := cors.Config{
		AllowOrigins:     []string{cfg.URLS.Frontend},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie", "X-Auth-Check", "X-User-ID"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	router.Use(cors.New(corsConfig))
	router.Use(middleware.ErrorHandler())

	gameAddUpdateLimiter := middleware.NewRateLimiter(1, time.Second, 3)
	readLimiter := middleware.NewRateLimiter(5, time.Second, 10)
	authLimiter := middleware.NewRateLimiter(10, time.Second, 20)
	deleteLimiter := middleware.NewRateLimiter(3, time.Second, 5)

	router.Use(func(c *gin.Context) {
		c.Set("gameAddUpdateLimiter", gameAddUpdateLimiter)
		c.Set("readLimiter", readLimiter)
		c.Set("authLimiter", authLimiter)
		c.Set("deleteLimiter", deleteLimiter)
		c.Next()
	})

	api := router.Group("/")
	hdlrs.RegisterRoutes(api)

	return router
}

func (a *App) Run() error {
	a.server = &http.Server{
		Addr:    ":" + a.config.Port,
		Handler: a.router,
	}

	go func() {
		log.Printf("Starting server on port %s", a.config.Port)
		if err := a.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := a.server.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	if err := a.database.Close(); err != nil {
		log.Printf("Failed to close database: %v", err)
	}

	log.Println("Server stopped")
	return nil
}
