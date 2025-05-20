package repositories

import (
	"context"

	"gamecheck/internal/domain/models"
)

// Repository определяет интерфейс для всех репозиториев приложения
type Repository interface {
	UserRepository
	ActivityRepository
	SubscriptionRepository
	TokenRepository
}

// UserRepository определяет методы для работы с пользователями
type UserRepository interface {
	CreateUser(ctx context.Context, user *models.User) error
	UpdateUser(ctx context.Context, user *models.User) error

	GetUserByID(ctx context.Context, id string) (*models.User, error)
	GetUserBySteamID(ctx context.Context, steamID string) (*models.User, error)
	SearchUsers(ctx context.Context, query string) ([]*models.User, error)

	IsFollowing(ctx context.Context, followerID, followingID string) (bool, error)
	CountFollowers(ctx context.Context, userID string) (int, error)
	CountFollowing(ctx context.Context, userID string) (int, error)
}

// ActivityRepository определяет методы для работы с активностями
type ActivityRepository interface {
	CreateActivity(ctx context.Context, activity *models.Activity) error

	GetFeed(ctx context.Context, limit, offset int) ([]*models.Activity, error)
	GetUserActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error)
	GetFollowingActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error)
}

// SubscriptionRepository определяет методы для работы с подписками
type SubscriptionRepository interface {
	Follow(ctx context.Context, followerID, followingID string) error
	Unfollow(ctx context.Context, followerID, followingID string) error

	GetFollowers(ctx context.Context, userID string) ([]*models.User, error)
	GetFollowing(ctx context.Context, userID string) ([]*models.User, error)
}

// TokenRepository определяет методы для работы с токенами
type TokenRepository interface {
	CreateToken(ctx context.Context, token *models.Token) error
	DeleteToken(ctx context.Context, tokenString string) error
	DeleteUserTokens(ctx context.Context, userID string) error

	GetTokenByValue(ctx context.Context, tokenString string) (*models.Token, error)
}
