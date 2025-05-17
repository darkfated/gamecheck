package services

import (
	"context"
	"fmt"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"
)

// ActivityService предоставляет методы для работы с активностями
type ActivityService struct {
	activityRepo repositories.ActivityRepository
	userRepo     repositories.UserRepository
}

// NewActivityService создает новый экземпляр сервиса активностей
func NewActivityService(
	activityRepo repositories.ActivityRepository,
	userRepo repositories.UserRepository,
) *ActivityService {
	return &ActivityService{
		activityRepo: activityRepo,
		userRepo:     userRepo,
	}
}

// CreateActivity создает новую запись активности
func (s *ActivityService) CreateActivity(ctx context.Context, activity *models.Activity) error {
	return s.activityRepo.CreateActivity(ctx, activity)
}

// GetFeed получает общую ленту активности
func (s *ActivityService) GetFeed(ctx context.Context, limit, offset int) ([]*models.Activity, error) {
	activities, err := s.activityRepo.GetFeed(ctx, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении ленты активности: %w", err)
	}
	return activities, nil
}

// GetUserActivity получает активность конкретного пользователя
func (s *ActivityService) GetUserActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error) {
	_, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("пользователь не найден: %w", err)
	}

	activities, err := s.activityRepo.GetUserActivity(ctx, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении активности пользователя: %w", err)
	}
	return activities, nil
}

// GetFollowingActivity получает активность пользователей, на которых подписан указанный пользователь
func (s *ActivityService) GetFollowingActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error) {
	_, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("пользователь не найден: %w", err)
	}

	activities, err := s.activityRepo.GetFollowingActivity(ctx, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении активности подписок: %w", err)
	}
	return activities, nil
}
