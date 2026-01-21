package repositories

import (
	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
)

type SubscriptionRepository struct {
	db *gorm.DB
}

func NewSubscriptionRepository(db *gorm.DB) *SubscriptionRepository {
	return &SubscriptionRepository{db: db}
}

func (r *SubscriptionRepository) Create(sub *models.Subscription) error {
	return r.db.Create(sub).Error
}

func (r *SubscriptionRepository) GetByID(id string) (*models.Subscription, error) {
	var sub models.Subscription
	if err := r.db.
		Preload("Follower").
		Preload("Following").
		First(&sub, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &sub, nil
}

func (r *SubscriptionRepository) GetFollowers(userID string) ([]*models.User, error) {
	var users []*models.User
	err := r.db.
		Joins("INNER JOIN subscriptions ON subscriptions.follower_id = users.id").
		Where("subscriptions.following_id = ?", userID).
		Find(&users).Error
	return users, err
}

func (r *SubscriptionRepository) GetFollowing(userID string) ([]*models.User, error) {
	var users []*models.User
	err := r.db.
		Joins("INNER JOIN subscriptions ON subscriptions.following_id = users.id").
		Where("subscriptions.follower_id = ?", userID).
		Find(&users).Error
	return users, err
}

func (r *SubscriptionRepository) IsFollowing(followerID, followingID string) (bool, error) {
	var count int64
	err := r.db.Model(&models.Subscription{}).
		Where("follower_id = ? AND following_id = ?", followerID, followingID).
		Count(&count).Error
	return count > 0, err
}

func (r *SubscriptionRepository) Delete(id string) error {
	return r.db.Delete(&models.Subscription{}, "id = ?", id).Error
}

func (r *SubscriptionRepository) DeleteByUsers(followerID, followingID string) error {
	return r.db.Delete(&models.Subscription{}, "follower_id = ? AND following_id = ?", followerID, followingID).Error
}

func (r *SubscriptionRepository) GetFollowersCount(userID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Subscription{}).Where("following_id = ?", userID).Count(&count).Error
	return count, err
}

func (r *SubscriptionRepository) GetFollowingCount(userID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Subscription{}).Where("follower_id = ?", userID).Count(&count).Error
	return count, err
}
