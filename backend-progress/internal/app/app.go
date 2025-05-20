package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gamecheck/progress-service/internal/config"
	"github.com/gamecheck/progress-service/internal/handlers"
	"github.com/gamecheck/progress-service/internal/infra/db"
	"github.com/gamecheck/progress-service/internal/infra/db/repositories"
	"github.com/gamecheck/progress-service/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Application struct {
	config      *config.Config
	router      *gin.Engine
	database    *db.Database
	httpServer  *http.Server
	shutdownFns []func() error
}

func New(cfg *config.Config) (*Application, error) {
	database, err := db.NewDatabase(cfg)
	if err != nil {
		return nil, err
	}

	progressRepo := repositories.NewProgressRepository(database.GetDB())
	progressService := service.NewProgressService(progressRepo)
	progressHandlers := handlers.NewProgressHandlers(progressService)

	router := setupRouter(cfg, progressHandlers)

	app := &Application{
		config:   cfg,
		router:   router,
		database: database,
		shutdownFns: []func() error{
			database.Close,
		},
	}

	return app, nil
}

func setupRouter(cfg *config.Config, progressHandlers *handlers.ProgressHandlers) *gin.Engine {
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie", "X-User-ID"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	log.Printf("CORS настроен для следующих источников: %v", corsConfig.AllowOrigins)
	router.Use(cors.New(corsConfig))

	routerHandler := handlers.NewRouter(cfg, progressHandlers)
	routerHandler.SetupRoutes(router)

	return router
}

func (a *Application) Run() error {
	a.httpServer = &http.Server{
		Addr:    ":" + a.config.Port,
		Handler: a.router,
	}

	go func() {
		log.Printf("Сервис прогресса запущен на http://localhost:%s", a.config.Port)
		if err := a.httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Ошибка при запуске сервера: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Завершение работы сервера...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := a.httpServer.Shutdown(ctx); err != nil {
		log.Printf("Ошибка при завершении работы сервера: %v", err)
		return err
	}

	for _, fn := range a.shutdownFns {
		if err := fn(); err != nil {
			log.Printf("Ошибка при завершении работы: %v", err)
		}
	}

	log.Println("Сервер успешно остановлен")
	return nil
}
