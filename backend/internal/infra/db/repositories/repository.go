package repositories

import "gorm.io/gorm"

type Repository struct {
	User         *UserRepository
	Progress     *ProgressRepository
	Activity     *ActivityRepository
	Token        *TokenRepository
	Subscription *SubscriptionRepository
}

func New(
	userRepo *UserRepository,
	progressRepo *ProgressRepository,
	activityRepo *ActivityRepository,
	tokenRepo *TokenRepository,
	subscriptionRepo *SubscriptionRepository,
) *Repository {
	return &Repository{
		User:         userRepo,
		Progress:     progressRepo,
		Activity:     activityRepo,
		Token:        tokenRepo,
		Subscription: subscriptionRepo,
	}
}

func NewRepositories(db *gorm.DB) *Repository {
	return New(
		NewUserRepository(db),
		NewProgressRepository(db),
		NewActivityRepository(db),
		NewTokenRepository(db),
		NewSubscriptionRepository(db),
	)
}
