package service

import (
	"context"
	"errors"

	"github.com/gamecheck/progress-service/internal/domain/models"
	"github.com/gamecheck/progress-service/internal/domain/repositories"
)

// Errors
var (
	ErrProgressNotFound = errors.New("прогресс не найден")
	ErrInvalidUserID    = errors.New("некорректный ID пользователя")
	ErrInvalidData      = errors.New("некорректные данные")
	ErrUnauthorized     = errors.New("неавторизованный доступ")
)

// ProgressService представляет сервис для работы с прогрессом
type ProgressService struct {
	repo repositories.ProgressRepository
}

// NewProgressService создает новый сервис прогресса
func NewProgressService(repo repositories.ProgressRepository) *ProgressService {
	return &ProgressService{repo: repo}
}

// CreateProgress создает новую запись о прогрессе
func (s *ProgressService) CreateProgress(ctx context.Context, progress *models.Progress) error {
	if progress.UserID == "" {
		return ErrInvalidUserID
	}

	if progress.Name == "" || progress.Status == "" {
		return ErrInvalidData
	}

	// Создание прогресса
	return s.repo.Create(ctx, progress)
}

// GetProgressByID возвращает запись о прогрессе по ID
func (s *ProgressService) GetProgressByID(ctx context.Context, id string) (*models.Progress, error) {
	progress, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if progress == nil {
		return nil, ErrProgressNotFound
	}
	return progress, nil
}

// GetUserProgress возвращает все записи прогресса для пользователя
func (s *ProgressService) GetUserProgress(ctx context.Context, userID string) ([]*models.Progress, error) {
	if userID == "" {
		return nil, ErrInvalidUserID
	}

	return s.repo.GetByUserID(ctx, userID)
}

// UpdateProgress обновляет запись о прогрессе
func (s *ProgressService) UpdateProgress(ctx context.Context, progress *models.Progress) error {
	if progress.ID == "" {
		return ErrInvalidData
	}

	existingProgress, err := s.repo.GetByID(ctx, progress.ID)
	if err != nil {
		return err
	}
	if existingProgress == nil {
		return ErrProgressNotFound
	}

	// Проверяем, что пользователь имеет право обновлять этот прогресс
	if existingProgress.UserID != progress.UserID {
		return ErrUnauthorized
	}

	if progress.Status != "" {
		existingProgress.Status = progress.Status
	}

	// Обрабатываем рейтинг (может быть nil или валидным значением)
	if progress.Rating != nil {
		// Проверяем, что рейтинг находится в допустимом диапазоне 1-10
		if *progress.Rating < 1 || *progress.Rating > 10 {
			return ErrInvalidData
		}
		existingProgress.Rating = progress.Rating
	} else {
		// Если в запросе передан explicit nil, устанавливаем рейтинг в nil
		existingProgress.Rating = nil
	}

	if progress.Review != "" {
		existingProgress.Review = progress.Review
	} else if progress.Review == "" && len(progress.Status) > 0 {
		// Если review явно передан как пустая строка, и есть другие изменения
		// то обновляем поле, а не просто пропускаем его
		existingProgress.Review = ""
	}

	if progress.Name != "" {
		existingProgress.Name = progress.Name
	}

	return s.repo.Update(ctx, existingProgress)
}

// DeleteProgress удаляет запись о прогрессе
func (s *ProgressService) DeleteProgress(ctx context.Context, id string, userID string) error {
	// Проверяем существование прогресса
	progress, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if progress == nil {
		return ErrProgressNotFound
	}

	// Проверяем, что пользователь имеет право удалять этот прогресс
	if progress.UserID != userID {
		return ErrUnauthorized
	}

	return s.repo.Delete(ctx, id)
}

// ListProgress возвращает список прогресса с пагинацией и фильтрацией
func (s *ProgressService) ListProgress(ctx context.Context, page, pageSize int, filters map[string]interface{}) ([]*models.Progress, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	return s.repo.ListAll(ctx, page, pageSize, filters)
}
