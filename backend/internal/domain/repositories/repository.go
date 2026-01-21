package repositories

import "gamecheck/internal/domain/models"

type UserRepository interface {
	Create(user *models.User) error
	GetByID(id string) (*models.User, error)
	GetBySteamID(steamID string) (*models.User, error)
	Update(user *models.User) error
	Delete(id string) error
	Search(query string, limit int) ([]*models.User, error)
	List(limit, offset int) ([]*models.User, error)
}

type ProgressRepository interface {
	Create(progress *models.Progress) error
	GetByID(id string) (*models.Progress, error)
	GetByUserID(userID string) ([]*models.Progress, error)
	Update(progress *models.Progress) error
	Delete(id string) error
	GetByUserIDAndName(userID, name string) (*models.Progress, error)
}

type ActivityRepository interface {
	Create(activity *models.Activity) error
	GetByID(id string) (*models.Activity, error)
	GetByUserID(userID string, limit int) ([]*models.Activity, error)
	GetFeed(userID string, limit int) ([]*models.Activity, error)
	Delete(id string) error
	DeleteByProgressID(progressID string) error
}

type TokenRepository interface {
	Create(token *models.Token) error
	GetByToken(token string) (*models.Token, error)
	GetByUserID(userID string) (*models.Token, error)
	Delete(id string) error
	DeleteByUserID(userID string) error
}

type SubscriptionRepository interface {
	Create(sub *models.Subscription) error
	GetByID(id string) (*models.Subscription, error)
	GetFollowers(userID string) ([]*models.User, error)
	GetFollowing(userID string) ([]*models.User, error)
	IsFollowing(followerID, followingID string) (bool, error)
	Delete(id string) error
	DeleteByUsers(followerID, followingID string) error
	GetFollowersCount(userID string) (int64, error)
	GetFollowingCount(userID string) (int64, error)
}
