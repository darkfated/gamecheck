package handlers

import (
	"gamecheck/internal/config"
	"gamecheck/internal/infra/db/repositories"
	"gamecheck/internal/services"

	"github.com/gin-gonic/gin"
)

type Handlers struct {
	Auth         *AuthHandler
	User         *UserHandler
	Progress     *ProgressHandler
	Activity     *ActivityHandler
	Subscription *SubscriptionHandler
}

func New(
	cfg *config.Config,
	svcs *services.Services,
	repos *repositories.Repository,
) *Handlers {
	return &Handlers{
		Auth: NewAuthHandler(
			cfg,
			svcs.Auth,
			svcs.User,
			svcs.Steam,
		),
		User: NewUserHandler(
			svcs.User,
			svcs.Auth,
		),
		Progress: NewProgressHandler(
			svcs.Progress,
			svcs.Auth,
			svcs.Steam,
		),
		Activity: NewActivityHandler(
			svcs.Activity,
			svcs.Auth,
		),
		Subscription: NewSubscriptionHandler(
			repos.Subscription,
			svcs.Activity,
			svcs.Auth,
		),
	}
}

func (h *Handlers) RegisterRoutes(router *gin.RouterGroup) {
	h.Auth.RegisterRoutes(router)
	h.User.RegisterRoutes(router)
	h.Progress.RegisterRoutes(router)
	h.Activity.RegisterRoutes(router)
	h.Subscription.RegisterRoutes(router)
}
