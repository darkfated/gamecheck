package app

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"gamecheck/config"
	"gamecheck/internal/controllers"
	"gamecheck/internal/domain/repositories"
	"gamecheck/internal/infra/db"
	dbRepo "gamecheck/internal/infra/db/repositories"
	"gamecheck/internal/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Application представляет основное приложение
type Application struct {
	config        *config.Config
	router        *gin.Engine
	database      *db.Database
	repositories  repositories.Repository
	services      *services.Services
	controllers   *controllers.Controllers
	shutdownFuncs []func() error
}

// New создает новый экземпляр приложения
func New(cfg *config.Config) (*Application, error) {
	// Инициализация базы данных
	database, err := db.NewDatabase(cfg)
	if err != nil {
		return nil, err
	}

	// Инициализация репозиториев
	userRepo := dbRepo.NewUserRepository(database.GetDB())
	activityRepo := dbRepo.NewActivityRepository(database.GetDB())
	subscriptionRepo := dbRepo.NewSubscriptionRepository(database.GetDB())
	tokenRepo := dbRepo.NewTokenRepository(database.GetDB())

	repos := dbRepo.NewRepository(userRepo, activityRepo, subscriptionRepo, tokenRepo)

	// Инициализация сервисов
	authService := services.NewAuthService(cfg, userRepo, tokenRepo, activityRepo)
	userService := services.NewUserService(userRepo, subscriptionRepo, activityRepo)
	activityService := services.NewActivityService(activityRepo, userRepo)

	svcs := services.NewServices(authService, userService, activityService)
	ctrls := controllers.NewControllers(cfg, svcs)

	router := setupRouter(cfg, ctrls)

	app := &Application{
		config:       cfg,
		router:       router,
		database:     database,
		repositories: repos,
		services:     svcs,
		controllers:  ctrls,
		shutdownFuncs: []func() error{
			database.Close,
		},
	}

	return app, nil
}

func setupRouter(cfg *config.Config, controllers *controllers.Controllers) *gin.Engine {
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// Настройка CORS
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5001", "http://localhost:*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cookie", "X-Auth-Check", "X-User-ID"},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	log.Printf("Настроен CORS для следующих источников: %v", corsConfig.AllowOrigins)
	log.Printf("Разрешенные заголовки: %v", corsConfig.AllowHeaders)
	router.Use(cors.New(corsConfig))

	controllers.RegisterRoutes(router)

	return router
}

// Run запускает HTTP-сервер
func (a *Application) Run() error {
	server := &http.Server{
		Addr:    ":" + a.config.Port,
		Handler: a.router,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Ошибка запуска сервера: %v", err)
		}
	}()

	log.Printf("Сервер GameCheck запущен на http://localhost:%s", a.config.Port)
	log.Printf("API доступен по адресу http://localhost:%s/api", a.config.Port)

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Завершение работы сервера...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Ошибка при завершении работы сервера: %v", err)
	}

	for _, fn := range a.shutdownFuncs {
		if err := fn(); err != nil {
			log.Printf("Ошибка при завершении работы: %v", err)
		}
	}

	log.Println("Сервер успешно остановлен")
	return nil
}
