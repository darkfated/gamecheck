package services

import (
	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"

	"github.com/google/uuid"
)

type ActivityService struct {
	activityRepository *repositories.ActivityRepository
	userRepository     *repositories.UserRepository
}

func NewActivityService(
	activityRepo *repositories.ActivityRepository,
	userRepo *repositories.UserRepository,
) *ActivityService {
	return &ActivityService{
		activityRepository: activityRepo,
		userRepository:     userRepo,
	}
}

func (s *ActivityService) GetFeed(userID string, limit int) ([]*models.Activity, error) {
	return s.activityRepository.GetFeed(userID, limit)
}

func (s *ActivityService) GetAllActivities(limit int) ([]*models.Activity, error) {
	return s.activityRepository.GetAllActivities(limit)
}

func (s *ActivityService) GetUserActivity(userID string, limit int) ([]*models.Activity, error) {
	return s.activityRepository.GetByUserID(userID, limit)
}

func (s *ActivityService) Follow(followerID, followingID string) (*models.Activity, error) {
	activity := &models.Activity{
		ID:           uuid.New().String(),
		UserID:       followerID,
		Type:         models.ActivityTypeFollow,
		TargetUserID: &followingID,
	}

	if err := s.activityRepository.Create(activity); err != nil {
		return nil, err
	}

	return activity, nil
}

func (s *ActivityService) Unfollow(followerID, followingID string) error {
	return nil
}
