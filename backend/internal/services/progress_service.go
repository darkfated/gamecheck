package services

import (
	"context"
	"time"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"

	"github.com/google/uuid"
)

// ProgressService предоставляет функциональность для работы с прогрессом пользователей
type ProgressService struct {
	progressRepo    repositories.ProgressRepository
	activityService *ActivityService
}

// NewProgressService создает новый экземпляр сервиса прогресса
func NewProgressService(progressRepo repositories.ProgressRepository, activityService *ActivityService) *ProgressService {
	return &ProgressService{
		progressRepo:    progressRepo,
		activityService: activityService,
	}
}

// GetProgressByID возвращает прогресс по его идентификатору
func (s *ProgressService) GetProgressByID(ctx context.Context, id string) (*models.Progress, error) {
	return s.progressRepo.GetProgressByID(ctx, id)
}

// GetProgressByUserID возвращает список прогресса для указанного пользователя
func (s *ProgressService) GetProgressByUserID(ctx context.Context, userID string) ([]*models.Progress, error) {
	return s.progressRepo.GetProgressByUserID(ctx, userID)
}

// AddProgress добавляет новую запись о прогрессе
func (s *ProgressService) AddProgress(ctx context.Context, progress *models.Progress) error {
	if progress.ID == "" {
		progress.ID = uuid.New().String()
	}

	now := time.Now()
	progress.CreatedAt = now
	progress.UpdatedAt = now

	if err := s.progressRepo.CreateProgress(ctx, progress); err != nil {
		return err
	}

	// Создаем запись активности о новой игре
	activity := &models.Activity{
		UserID:     progress.UserID,
		Type:       models.ActivityTypeAddGame,
		ProgressID: &progress.ID,
		GameName:   &progress.Name,
		Status:     &progress.Status,
		CreatedAt:  now,
	}

	return s.activityService.CreateActivity(ctx, activity)
}

// UpdateProgress обновляет информацию о прогрессе
func (s *ProgressService) UpdateProgress(ctx context.Context, progress *models.Progress) error {
	oldProgress, err := s.progressRepo.GetProgressByID(ctx, progress.ID)
	if err != nil {
		return err
	}

	// Если статус изменился, создаем запись активности
	if oldProgress.Status != progress.Status {
		activity := &models.Activity{
			UserID:     progress.UserID,
			Type:       models.ActivityTypeUpdateStatus,
			ProgressID: &progress.ID,
			GameName:   &progress.Name,
			Status:     &progress.Status,
			CreatedAt:  time.Now(),
		}
		if err := s.activityService.CreateActivity(ctx, activity); err != nil {
			return err
		}
	}

	return s.progressRepo.UpdateProgress(ctx, progress)
}

// DeleteProgress удаляет запись о прогрессе
func (s *ProgressService) DeleteProgress(ctx context.Context, id string, userID string) error {
	return s.progressRepo.DeleteProgress(ctx, id, userID)
}
