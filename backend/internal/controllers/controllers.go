package controllers

import (
	"gamecheck/config"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

// Controllers объединяет все контроллеры приложения
type Controllers struct {
	config   *config.Config
	services *services.Services
	Auth     *AuthController
	User     *UserController
	Activity *ActivityController
}

// NewControllers создает новый экземпляр композитного контроллера
func NewControllers(cfg *config.Config, services *services.Services) *Controllers {
	authController := NewAuthController(cfg, services.Auth)

	userController := NewUserController(services.User, authController)
	activityController := NewActivityController(services.Activity, authController)

	return &Controllers{
		config:   cfg,
		services: services,
		Auth:     authController,
		User:     userController,
		Activity: activityController,
	}
}

// RegisterRoutes регистрирует маршруты для всех контроллеров
func (c *Controllers) RegisterRoutes(router *gin.Engine) {
	api := router.Group("/api")

	c.Auth.RegisterRoutes(api)
	c.User.RegisterRoutes(api)
	c.Activity.RegisterRoutes(api)
}
