package repositories

import (
	"context"
	"errors"

	"github.com/gamecheck/progress-service/internal/domain/models"
	"github.com/gamecheck/progress-service/internal/domain/repositories"

	"gorm.io/gorm"
)

// GormProgressRepository представляет репозиторий прогресса, использующий Gorm
type GormProgressRepository struct {
	db *gorm.DB
}

// NewProgressRepository создает новый экземпляр репозитория прогресса
func NewProgressRepository(db *gorm.DB) repositories.ProgressRepository {
	return &GormProgressRepository{db: db}
}

// Create создает новую запись о прогрессе
func (r *GormProgressRepository) Create(ctx context.Context, progress *models.Progress) error {
	return r.db.WithContext(ctx).Create(progress).Error
}

// GetByID возвращает прогресс по ID
func (r *GormProgressRepository) GetByID(ctx context.Context, id string) (*models.Progress, error) {
	var progress models.Progress
	if err := r.db.WithContext(ctx).First(&progress, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &progress, nil
}

// GetByUserID возвращает все записи прогресса для пользователя
func (r *GormProgressRepository) GetByUserID(ctx context.Context, userID string) ([]*models.Progress, error) {
	var progresses []*models.Progress
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&progresses).Error; err != nil {
		return nil, err
	}
	return progresses, nil
}

// Update обновляет запись о прогрессе
func (r *GormProgressRepository) Update(ctx context.Context, progress *models.Progress) error {
	return r.db.WithContext(ctx).Save(progress).Error
}

// Delete удаляет запись о прогрессе по ID
func (r *GormProgressRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&models.Progress{}, "id = ?", id).Error
}

// ListAll возвращает все записи с пагинацией и фильтрацией
func (r *GormProgressRepository) ListAll(ctx context.Context, page, pageSize int, filters map[string]interface{}) ([]*models.Progress, int64, error) {
	var progresses []*models.Progress
	var total int64

	query := r.db.WithContext(ctx).Model(&models.Progress{})

	for field, value := range filters {
		query = query.Where(field+" = ?", value)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Find(&progresses).Error; err != nil {
		return nil, 0, err
	}

	return progresses, total, nil
}
