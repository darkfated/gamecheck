package services

import (
	"context"
	"fmt"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"
)

// UserService предоставляет методы для работы с пользователями
type UserService struct {
	userRepo         repositories.UserRepository
	subscriptionRepo repositories.SubscriptionRepository
	activityRepo     repositories.ActivityRepository
}

// NewUserService создает новый экземпляр сервиса пользователей
func NewUserService(
	userRepo repositories.UserRepository,
	subscriptionRepo repositories.SubscriptionRepository,
	activityRepo repositories.ActivityRepository,
) *UserService {
	return &UserService{
		userRepo:         userRepo,
		subscriptionRepo: subscriptionRepo,
		activityRepo:     activityRepo,
	}
}

// UpdateProfile обновляет профиль пользователя
func (s *UserService) UpdateProfile(ctx context.Context, userID string, bio, discordTag *string) (*models.User, error) {
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении пользователя: %w", err)
	}

	if discordTag != nil {
		user.DiscordTag = *discordTag
	}

	if err := s.userRepo.UpdateUser(ctx, user); err != nil {
		return nil, fmt.Errorf("ошибка при обновлении пользователя: %w", err)
	}

	return user, nil
}

// GetUserProfile получает профиль пользователя с дополнительной информацией
func (s *UserService) GetUserProfile(ctx context.Context, id string, currentUserID string) (*models.User, error) {
	user, err := s.userRepo.GetUserByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении пользователя: %w", err)
	}

	if currentUserID != "" {
		isFollowing, err := s.userRepo.IsFollowing(ctx, currentUserID, id)
		if err != nil {
			return nil, fmt.Errorf("ошибка при проверке подписки: %w", err)
		}
		user.IsFollowing = isFollowing
	}

	followersCount, err := s.userRepo.CountFollowers(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("ошибка при подсчете подписчиков: %w", err)
	}
	user.FollowersCount = followersCount

	followingCount, err := s.userRepo.CountFollowing(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("ошибка при подсчете подписок: %w", err)
	}
	user.FollowingCount = followingCount

	return user, nil
}

// SearchUsers ищет пользователей по части имени
func (s *UserService) SearchUsers(ctx context.Context, query string) ([]*models.User, error) {
	users, err := s.userRepo.SearchUsers(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("ошибка при поиске пользователей: %w", err)
	}
	return users, nil
}

// FollowUser подписывает пользователя на другого пользователя
func (s *UserService) FollowUser(ctx context.Context, followerID, followingID string) error {
	if err := s.subscriptionRepo.Follow(ctx, followerID, followingID); err != nil {
		return fmt.Errorf("ошибка при подписке: %w", err)
	}

	activity := &models.Activity{
		UserID:       followerID,
		Type:         models.ActivityTypeFollow,
		TargetUserID: &followingID,
	}
	if err := s.activityRepo.CreateActivity(ctx, activity); err != nil {
		return fmt.Errorf("ошибка при создании активности: %w", err)
	}

	return nil
}

// UnfollowUser отписывает пользователя от другого пользователя
func (s *UserService) UnfollowUser(ctx context.Context, followerID, followingID string) error {
	return s.subscriptionRepo.Unfollow(ctx, followerID, followingID)
}

// GetFollowers получает список подписчиков пользователя
func (s *UserService) GetFollowers(ctx context.Context, userID string) ([]*models.User, error) {
	return s.subscriptionRepo.GetFollowers(ctx, userID)
}

// GetFollowing получает список подписок пользователя
func (s *UserService) GetFollowing(ctx context.Context, userID string) ([]*models.User, error) {
	return s.subscriptionRepo.GetFollowing(ctx, userID)
}
