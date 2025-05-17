package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/darkfated/gamecheck/backend/game-service/config"
	"github.com/darkfated/gamecheck/backend/game-service/controller"
	"github.com/darkfated/gamecheck/backend/game-service/database"
	"github.com/darkfated/gamecheck/backend/game-service/model"
	"github.com/darkfated/gamecheck/backend/shared/middleware"
)

func main() {
	godotenv.Load()
	cfg := config.Load()
	db := database.Connect(cfg)
	db.AutoMigrate(&model.Game{})

	r := gin.Default()

	// Подключаем middleware
	r.Use(middleware.CORS())
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.RequestLogger())

	controller.RegisterRoutes(r, db, cfg)

	// Обработка несуществующих маршрутов
	r.NoRoute(middleware.NotFoundHandler())

	r.Run(":" + cfg.Port)
}
