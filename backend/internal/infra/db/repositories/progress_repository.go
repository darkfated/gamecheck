package repositories

import (
	"context"
	"errors"
	"fmt"
	"time"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ProgressRepositoryImpl реализация репозитория прогресса
type ProgressRepositoryImpl struct {
	db *gorm.DB
}

// NewProgressRepository создает новый экземпляр репозитория прогресса
func NewProgressRepository(db *gorm.DB) repositories.ProgressRepository {
	return &ProgressRepositoryImpl{db: db}
}

// CreateProgress создает новую запись прогресса в базе данных
func (r *ProgressRepositoryImpl) CreateProgress(ctx context.Context, progress *models.Progress) error {
	if progress.ID == "" {
		progress.ID = uuid.New().String()
	}
	now := time.Now()
	progress.CreatedAt = now
	progress.UpdatedAt = now

	return r.db.WithContext(ctx).Create(progress).Error
}

// UpdateProgress обновляет информацию о прогрессе
func (r *ProgressRepositoryImpl) UpdateProgress(ctx context.Context, progress *models.Progress) error {
	existingProgress, err := r.GetProgressByID(ctx, progress.ID)
	if err != nil {
		return err
	}

	if existingProgress.UserID != progress.UserID {
		return fmt.Errorf("нет прав на редактирование этого прогресса")
	}

	progress.UpdatedAt = time.Now()

	// Обновляем запись
	return r.db.WithContext(ctx).Model(progress).Updates(map[string]interface{}{
		"status":     progress.Status,
		"rating":     progress.Rating,
		"review":     progress.Review,
		"updated_at": progress.UpdatedAt,
	}).Error
}

// DeleteProgress удаляет прогресс из базы данных
func (r *ProgressRepositoryImpl) DeleteProgress(ctx context.Context, id string, userID string) error {
	var progress models.Progress
	if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&progress).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("прогресс не найден или не принадлежит пользователю")
		}
		return err
	}

	tx := r.db.WithContext(ctx).Begin()
	if tx.Error != nil {
		return tx.Error
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Where("progress_id = ?", id).Delete(&models.Activity{}).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("ошибка при удалении связанных записей активности: %w", err)
	}

	if err := tx.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Progress{}).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("ошибка при удалении прогресса: %w", err)
	}

	return tx.Commit().Error
}

// GetProgressByID возвращает прогресс по его ID
func (r *ProgressRepositoryImpl) GetProgressByID(ctx context.Context, id string) (*models.Progress, error) {
	var progress models.Progress
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&progress).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("прогресс не найден")
		}
		return nil, err
	}
	return &progress, nil
}

// GetProgressByUserID возвращает все записи прогресса пользователя
func (r *ProgressRepositoryImpl) GetProgressByUserID(ctx context.Context, userID string) ([]*models.Progress, error) {
	var progressItems []*models.Progress
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&progressItems).Error
	if err != nil {
		return nil, err
	}
	return progressItems, nil
}
