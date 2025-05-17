package repositories

import (
	"context"
	"fmt"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"

	"gorm.io/gorm"
)

// SubscriptionRepositoryImpl реализация репозитория подписок
type SubscriptionRepositoryImpl struct {
	db *gorm.DB
}

// NewSubscriptionRepository создает новый экземпляр репозитория подписок
func NewSubscriptionRepository(db *gorm.DB) repositories.SubscriptionRepository {
	return &SubscriptionRepositoryImpl{db: db}
}

// Follow создает новую подписку между пользователями
func (r *SubscriptionRepositoryImpl) Follow(ctx context.Context, followerID, followingID string) error {
	if followerID == followingID {
		return fmt.Errorf("нельзя подписаться на самого себя")
	}

	var count int64
	if err := r.db.WithContext(ctx).
		Model(&models.Subscription{}).
		Where("follower_id = ? AND following_id = ?", followerID, followingID).
		Count(&count).Error; err != nil {
		return err
	}

	if count > 0 {
		return fmt.Errorf("вы уже подписаны на этого пользователя")
	}

	subscription := &models.Subscription{
		FollowerID:  followerID,
		FollowingID: followingID,
	}

	return r.db.WithContext(ctx).Create(subscription).Error
}

// Unfollow удаляет подписку между пользователями
func (r *SubscriptionRepositoryImpl) Unfollow(ctx context.Context, followerID, followingID string) error {
	result := r.db.WithContext(ctx).
		Where("follower_id = ? AND following_id = ?", followerID, followingID).
		Delete(&models.Subscription{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("подписка не найдена")
	}

	return nil
}

// GetFollowers возвращает всех подписчиков пользователя
func (r *SubscriptionRepositoryImpl) GetFollowers(ctx context.Context, userID string) ([]*models.User, error) {
	var users []*models.User

	err := r.db.WithContext(ctx).
		Table("users").
		Joins("JOIN subscriptions ON users.id = subscriptions.follower_id").
		Where("subscriptions.following_id = ?", userID).
		Order("subscriptions.created_at DESC").
		Find(&users).Error

	if err != nil {
		return nil, err
	}

	return users, nil
}

// GetFollowing возвращает всех пользователей, на которых подписан указанный пользователь
func (r *SubscriptionRepositoryImpl) GetFollowing(ctx context.Context, userID string) ([]*models.User, error) {
	var users []*models.User

	err := r.db.WithContext(ctx).
		Table("users").
		Joins("JOIN subscriptions ON users.id = subscriptions.following_id").
		Where("subscriptions.follower_id = ?", userID).
		Order("subscriptions.created_at DESC").
		Find(&users).Error

	if err != nil {
		return nil, err
	}

	return users, nil
}
