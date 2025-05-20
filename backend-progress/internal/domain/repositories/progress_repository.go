package repositories

import (
	"context"

	"github.com/gamecheck/progress-service/internal/domain/models"
)

type ProgressRepository interface {
	// Create создает новую запись о прогрессе
	Create(ctx context.Context, progress *models.Progress) error

	// GetByID возвращает прогресс по ID
	GetByID(ctx context.Context, id string) (*models.Progress, error)

	// GetByUserID возвращает все записи прогресса для пользователя
	GetByUserID(ctx context.Context, userID string) ([]*models.Progress, error)

	// Update обновляет запись о прогрессе
	Update(ctx context.Context, progress *models.Progress) error

	// Delete удаляет запись о прогрессе по ID
	Delete(ctx context.Context, id string) error

	// ListAll возвращает все записи с пагинацией и фильтрацией
	ListAll(ctx context.Context, page, pageSize int, filters map[string]interface{}) ([]*models.Progress, int64, error)
}
