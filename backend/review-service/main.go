package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/darkfated/gamecheck/backend/review-service/config"
	"github.com/darkfated/gamecheck/backend/review-service/controller"
	"github.com/darkfated/gamecheck/backend/review-service/database"
	"github.com/darkfated/gamecheck/backend/review-service/model"
	"github.com/darkfated/gamecheck/backend/review-service/repository"
	"github.com/darkfated/gamecheck/backend/review-service/service"
	"github.com/darkfated/gamecheck/backend/shared/middleware"
)

func main() {
	godotenv.Load()
	cfg := config.Load()
	db := database.Connect(cfg)
	db.AutoMigrate(&model.Review{})

	repo := repository.NewReviewRepo(db)
	svc := service.NewReviewService(repo, cfg.GameServiceURL)

	r := gin.Default()

	// Подключаем middleware
	r.Use(middleware.CORS())
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.RequestLogger())

	authMw := middleware.JWTAuth()
	controller.RegisterRoutes(r, svc, authMw)
	r.NoRoute(middleware.NotFoundHandler())

	r.Run(":" + cfg.Port)
}
