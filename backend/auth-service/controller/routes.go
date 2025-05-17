package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/darkfated/gamecheck/backend/auth-service/config"
	"github.com/darkfated/gamecheck/backend/auth-service/model"
	"github.com/darkfated/gamecheck/backend/auth-service/repository"
	"github.com/darkfated/gamecheck/backend/auth-service/service"

	"github.com/darkfated/gamecheck/backend/shared/dto"
	"github.com/darkfated/gamecheck/backend/shared/middleware"
)

func RegisterRoutes(r *gin.Engine, db *gorm.DB, cfg *config.Config) {
	userRepo := repository.NewUserRepo(db)
	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)

	api := r.Group("/v1/auth")
	api.POST("/signup", func(c *gin.Context) {
		var body model.User
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}
		if err := authSvc.Signup(&body); err != nil {
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: err.Error()})
			return
		}
		c.Status(http.StatusCreated)
	})

	api.POST("/login", func(c *gin.Context) {
		var creds struct{ Email, Password string }
		if err := c.ShouldBindJSON(&creds); err != nil {
			c.JSON(http.StatusBadRequest, dto.ErrorResponse{Error: err.Error()})
			return
		}
		token, user, err := authSvc.Login(creds.Email, creds.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: err.Error()})
			return
		}

		// Возвращаем токен и данные пользователя (без пароля)
		c.JSON(http.StatusOK, gin.H{
			"token": token,
			"user": gin.H{
				"id":       user.ID,
				"username": user.Username,
				"email":    user.Email,
				"role":     user.Role,
			},
		})
	})

	// Маршрут для получения данных текущего пользователя
	authRequired := r.Group("/v1/auth").Use(middleware.JWTAuth())
	authRequired.GET("/me", func(c *gin.Context) {
		userID, exists := middleware.GetUserIDFromContext(c)
		if !exists {
			c.JSON(http.StatusUnauthorized, dto.ErrorResponse{Error: "unauthorized"})
			return
		}

		user, err := userRepo.FindByID(userID)
		if err != nil {
			c.JSON(http.StatusNotFound, dto.ErrorResponse{Error: "user not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
		})
	})
}
