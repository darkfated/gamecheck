package repositories

import (
	"context"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"

	"gorm.io/gorm"
)

// ActivityRepositoryImpl реализация репозитория активностей
type ActivityRepositoryImpl struct {
	db *gorm.DB
}

// NewActivityRepository создает новый экземпляр репозитория активностей
func NewActivityRepository(db *gorm.DB) repositories.ActivityRepository {
	return &ActivityRepositoryImpl{db: db}
}

// CreateActivity создает новую запись активности
func (r *ActivityRepositoryImpl) CreateActivity(ctx context.Context, activity *models.Activity) error {
	return r.db.WithContext(ctx).Create(activity).Error
}

// GetFeed возвращает общую ленту активности всех пользователей
func (r *ActivityRepositoryImpl) GetFeed(ctx context.Context, limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity

	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("Progress").
		Preload("TargetUser").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&activities).Error

	if err != nil {
		return nil, err
	}

	return activities, nil
}

// GetUserActivity возвращает активность конкретного пользователя
func (r *ActivityRepositoryImpl) GetUserActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity

	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("Progress").
		Preload("TargetUser").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&activities).Error

	if err != nil {
		return nil, err
	}

	return activities, nil
}

// GetFollowingActivity возвращает активность пользователей, на которых подписан указанный пользователь
func (r *ActivityRepositoryImpl) GetFollowingActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity

	// Подзапрос для получения ID пользователей, на которых подписан указанный пользователь
	subQuery := r.db.Table("subscriptions").
		Select("following_id").
		Where("follower_id = ?", userID)

	err := r.db.WithContext(ctx).
		Preload("User").
		Preload("Progress").
		Preload("TargetUser").
		Where("user_id IN (?)", subQuery).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&activities).Error

	if err != nil {
		return nil, err
	}

	return activities, nil
}
