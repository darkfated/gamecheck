package services

import (
	"time"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"

	"github.com/google/uuid"
)

type ActivityUser struct {
	ID          string `json:"id"`
	DisplayName string `json:"displayName"`
	AvatarURL   string `json:"avatarUrl"`
}

type ActivityProgress struct {
	SteamAppID   *int   `json:"steamAppId,omitempty"`
	SteamIconURL string `json:"steamIconUrl,omitempty"`
}

type ActivityResponse struct {
	ID           string              `json:"id"`
	Type         models.ActivityType `json:"type"`
	UserID       string              `json:"userId"`
	User         ActivityUser        `json:"user"`
	ProgressID   *string             `json:"progressId,omitempty"`
	Progress     *ActivityProgress   `json:"progress,omitempty"`
	GameName     *string             `json:"gameName,omitempty"`
	Status       *models.GameStatus  `json:"status,omitempty"`
	Rating       *int                `json:"rating,omitempty"`
	TargetUserID *string             `json:"targetUserId,omitempty"`
	TargetUser   *ActivityUser       `json:"targetUser,omitempty"`
	CreatedAt    time.Time           `json:"createdAt"`
}

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

func (s *ActivityService) GetFeed(userID string, limit, offset int) ([]*ActivityResponse, error) {
	rows, err := s.activityRepository.GetFeedRows(userID, limit, offset)
	if err != nil {
		return nil, err
	}
	return mapActivityRows(rows), nil
}

func (s *ActivityService) GetAllActivities(limit, offset int) ([]*ActivityResponse, error) {
	rows, err := s.activityRepository.GetAllRows(limit, offset)
	if err != nil {
		return nil, err
	}
	return mapActivityRows(rows), nil
}

func (s *ActivityService) GetUserActivity(userID string, limit, offset int) ([]*ActivityResponse, error) {
	rows, err := s.activityRepository.GetByUserIDRows(userID, limit, offset)
	if err != nil {
		return nil, err
	}
	return mapActivityRows(rows), nil
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

func mapActivityRows(rows []repositories.ActivityRow) []*ActivityResponse {
	results := make([]*ActivityResponse, 0, len(rows))
	for i := range rows {
		results = append(results, mapActivityRow(&rows[i]))
	}
	return results
}

func mapActivityRow(row *repositories.ActivityRow) *ActivityResponse {
	if row == nil {
		return nil
	}

	resp := &ActivityResponse{
		ID:           row.ID,
		Type:         row.Type,
		UserID:       row.UserID,
		ProgressID:   row.ProgressID,
		GameName:     row.GameName,
		Status:       row.Status,
		Rating:       row.Rating,
		TargetUserID: row.TargetUserID,
		CreatedAt:    row.CreatedAt,
		User: ActivityUser{
			ID:          row.UserID,
			DisplayName: row.UserDisplayName,
			AvatarURL:   row.UserAvatarURL,
		},
	}

	if row.ProgressID != nil {
		resp.Progress = &ActivityProgress{
			SteamAppID:   row.SteamAppID,
			SteamIconURL: row.SteamIconURL,
		}
	}

	if row.TargetUserID != nil {
		resp.TargetUser = &ActivityUser{
			ID:          *row.TargetUserID,
			DisplayName: stringOrEmpty(row.TargetDisplayName),
			AvatarURL:   stringOrEmpty(row.TargetAvatarURL),
		}
	}

	return resp
}

func stringOrEmpty(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}
