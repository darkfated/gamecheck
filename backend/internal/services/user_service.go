package services

import (
	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"
)

type UserService struct {
	userRepository         *repositories.UserRepository
	subscriptionRepository *repositories.SubscriptionRepository
	activityRepository     *repositories.ActivityRepository
}

func NewUserService(
	userRepo *repositories.UserRepository,
	subscriptionRepo *repositories.SubscriptionRepository,
	activityRepo *repositories.ActivityRepository,
) *UserService {
	return &UserService{
		userRepository:         userRepo,
		subscriptionRepository: subscriptionRepo,
		activityRepository:     activityRepo,
	}
}

func (s *UserService) GetUser(id string) (*models.User, error) {
	return s.userRepository.GetByID(id)
}

func (s *UserService) UpdateProfile(id string, displayName, discordTag string) (*models.User, error) {
	user, err := s.userRepository.GetByID(id)
	if err != nil {
		return nil, err
	}

	user.DisplayName = displayName
	user.DiscordTag = discordTag

	if err := s.userRepository.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) SearchUsers(query string, limit int) ([]*models.User, error) {
	return s.userRepository.Search(query, limit)
}

func (s *UserService) GetUserWithStats(id string) (*models.User, error) {
	user, err := s.userRepository.GetByID(id)
	if err != nil {
		return nil, err
	}

	followersCount, _ := s.subscriptionRepository.GetFollowersCount(id)
	followingCount, _ := s.subscriptionRepository.GetFollowingCount(id)

	user.FollowersCount = int(followersCount)
	user.FollowingCount = int(followingCount)

	return user, nil
}

func (s *UserService) GetUserProfile(userID, currentUserID string) (*models.User, error) {
	user, err := s.GetUserWithStats(userID)
	if err != nil {
		return nil, err
	}

	if currentUserID != "" {
		isFollowing, _ := s.subscriptionRepository.IsFollowing(currentUserID, userID)
		user.IsFollowing = isFollowing
	}

	return user, nil
}

func (s *UserService) ListUsers(limit, offset int, sortBy, order string) ([]*models.User, int64, error) {
	users, err := s.userRepository.List(limit, offset)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.userRepository.Count()
	if err != nil {
		return nil, 0, err
	}

	for _, user := range users {
		stats, _ := s.userRepository.GetWithStats(user.ID)
		if stats != nil {
			user.GamesCount = stats.GamesCount
			user.TotalPlaytime = stats.TotalPlaytime
			user.AverageRating = stats.AverageRating
		}
	}

	return users, total, nil
}
