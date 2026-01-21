package repositories

import (
	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
)

type ProgressRepository struct {
	db *gorm.DB
}

func NewProgressRepository(db *gorm.DB) *ProgressRepository {
	return &ProgressRepository{db: db}
}

func (r *ProgressRepository) Create(progress *models.Progress) error {
	return r.db.Create(progress).Error
}

func (r *ProgressRepository) GetByID(id string) (*models.Progress, error) {
	var progress models.Progress
	if err := r.db.Preload("User").First(&progress, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *ProgressRepository) GetByUserID(userID string) ([]*models.Progress, error) {
	var progress []*models.Progress
	err := r.db.Preload("User").Where("user_id = ?", userID).Order("created_at DESC").Find(&progress).Error
	return progress, err
}

func (r *ProgressRepository) Update(progress *models.Progress) error {
	return r.db.Save(progress).Error
}

func (r *ProgressRepository) Delete(id string) error {
	return r.db.Delete(&models.Progress{}, "id = ?", id).Error
}

func (r *ProgressRepository) GetByUserIDAndName(userID, name string) (*models.Progress, error) {
	var progress models.Progress
	err := r.db.Where("user_id = ? AND name = ?", userID, name).First(&progress).Error
	return &progress, err
}
