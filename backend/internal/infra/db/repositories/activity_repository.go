package repositories

import (
	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
)

type ActivityRepository struct {
	db *gorm.DB
}

func NewActivityRepository(db *gorm.DB) *ActivityRepository {
	return &ActivityRepository{db: db}
}

func (r *ActivityRepository) Create(activity *models.Activity) error {
	return r.db.Create(activity).Error
}

func (r *ActivityRepository) GetByID(id string) (*models.Activity, error) {
	var activity models.Activity
	if err := r.db.
		Preload("User").
		Preload("TargetUser").
		First(&activity, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &activity, nil
}

func (r *ActivityRepository) GetByUserID(userID string, limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity
	err := r.db.
		Preload("User").
		Preload("TargetUser").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) GetFeed(userID string, limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity
	err := r.db.
		Preload("User").
		Preload("TargetUser").
		Where("user_id IN (SELECT following_id FROM subscriptions WHERE follower_id = ?) OR user_id = ?", userID, userID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) GetAllActivities(limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity
	err := r.db.
		Preload("User").
		Preload("TargetUser").
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) Delete(id string) error {
	return r.db.Delete(&models.Activity{}, "id = ?", id).Error
}

func (r *ActivityRepository) DeleteByProgressID(progressID string) error {
	return r.db.Delete(&models.Activity{}, "progress_id = ?", progressID).Error
}
