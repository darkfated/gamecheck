package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/darkfated/gamecheck/backend/progress-service/config"
	"github.com/darkfated/gamecheck/backend/progress-service/controller"
	"github.com/darkfated/gamecheck/backend/progress-service/database"
	"github.com/darkfated/gamecheck/backend/progress-service/model"
	"github.com/darkfated/gamecheck/backend/progress-service/repository"
	"github.com/darkfated/gamecheck/backend/progress-service/service"
	"github.com/darkfated/gamecheck/backend/shared/middleware"
)

func main() {
	godotenv.Load()
	cfg := config.Load()
	db := database.Connect(cfg)
	db.AutoMigrate(&model.UserGame{})

	repo := repository.NewUGRepo(db)
	svc := service.NewProgressService(repo, cfg.GameServiceURL)

	r := gin.Default()

	// Подключаем middleware
	r.Use(middleware.CORS())
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.RequestLogger())

	authMw := middleware.JWTAuth()
	controller.RegisterRoutes(r, svc, authMw)

	// Обработка несуществующих маршрутов
	r.NoRoute(middleware.NotFoundHandler())

	r.Run(":" + cfg.Port)
}
