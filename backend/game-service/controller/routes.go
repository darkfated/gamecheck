package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/darkfated/gamecheck/backend/game-service/config"
	"github.com/darkfated/gamecheck/backend/game-service/model"
	"github.com/darkfated/gamecheck/backend/game-service/repository"
	"github.com/darkfated/gamecheck/backend/game-service/service"
	"github.com/darkfated/gamecheck/backend/shared/dto"
	"github.com/darkfated/gamecheck/backend/shared/middleware"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	repo := repository.NewGameRepo(db)
	svc := service.NewGameService(repo)

	api := r.Group("/v1/games")

	// Получение всех игр (публичный доступ)
	api.GET("", func(c *gin.Context) {
		games, err := repo.GetAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, games)
	})

	// Получение игры по ID (публичный доступ)
	api.GET("/:id", func(c *gin.Context) {
		g, err := repo.GetByID(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, g)
	})

	// Создаем middleware для проверки JWT с нашим секретным ключом
	jwtAuth := middleware.JWTAuth()

	// Маршруты, требующие JWT авторизации и роли admin
	adminAPI := api.Group("/", jwtAuth, middleware.AdminOnly())

	// Создание новой игры (только админ)
	adminAPI.POST("", func(c *gin.Context) {
		var g model.Game
		if err := c.ShouldBindJSON(&g); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}
		if err := repo.Create(&g); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusCreated, g)
	})

	// Обновление существующей игры (только админ)
	adminAPI.PUT("/:id", func(c *gin.Context) {
		var g model.Game
		if err := c.ShouldBindJSON(&g); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}

		// Получаем текущую игру, чтобы убедиться, что она существует
		existing, err := repo.GetByID(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "Game not found"})
			return
		}

		// Обновляем только разрешенные поля
		g.ID = existing.ID

		if err := repo.Update(&g); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.JSON(http.StatusOK, g)
	})

	// Ручной пересчет рейтинга игры (только админ)
	adminAPI.PUT("/:id/recalc-rating", func(c *gin.Context) {
		if err := svc.RecalcRating(c.Param("id")); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.Status(http.StatusNoContent)
	})

	// Удаление игры (только админ)
	adminAPI.DELETE("/:id", func(c *gin.Context) {
		if err := repo.Delete(c.Param("id")); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.Status(http.StatusNoContent)
	})
}
