package services

import (
	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"

	"github.com/google/uuid"
)

type ProgressService struct {
	progressRepository *repositories.ProgressRepository
	activityRepository *repositories.ActivityRepository
	steamService       *SteamService
}

func NewProgressService(
	progressRepo *repositories.ProgressRepository,
	activityRepo *repositories.ActivityRepository,
	steamService *SteamService,
) *ProgressService {
	return &ProgressService{
		progressRepository: progressRepo,
		activityRepository: activityRepo,
		steamService:       steamService,
	}
}

func (s *ProgressService) AddGame(userID, name, status string, rating *int, review string) (*models.Progress, error) {
	gameStatus := models.GameStatus(status)

	progress := &models.Progress{
		ID:     uuid.New().String(),
		UserID: userID,
		Name:   name,
		Status: gameStatus,
		Rating: rating,
		Review: review,
	}

	if err := s.progressRepository.Create(progress); err != nil {
		return nil, err
	}

	activity := &models.Activity{
		ID:         uuid.New().String(),
		UserID:     userID,
		Type:       models.ActivityTypeAddGame,
		ProgressID: &progress.ID,
		GameName:   &progress.Name,
		Status:     &progress.Status,
		Rating:     rating,
	}
	s.activityRepository.Create(activity)

	return progress, nil
}

func (s *ProgressService) AddGameWithSteamData(
	userID, name, status string,
	rating *int,
	review string,
	steamAppID *int,
	steamIconURL,
	steamStoreURL string,
	steamPlaytimeForever *int,
) (*models.Progress, error) {
	gameStatus := models.GameStatus(status)

	progress := &models.Progress{
		ID:                   uuid.New().String(),
		UserID:               userID,
		Name:                 name,
		Status:               gameStatus,
		Rating:               rating,
		Review:               review,
		SteamAppID:           steamAppID,
		SteamIconURL:         steamIconURL,
		SteamStoreURL:        steamStoreURL,
		SteamPlaytimeForever: steamPlaytimeForever,
	}

	if err := s.progressRepository.Create(progress); err != nil {
		return nil, err
	}

	activity := &models.Activity{
		ID:         uuid.New().String(),
		UserID:     userID,
		Type:       models.ActivityTypeAddGame,
		ProgressID: &progress.ID,
		GameName:   &progress.Name,
		Status:     &progress.Status,
		Rating:     rating,
	}
	s.activityRepository.Create(activity)

	return progress, nil
}

func (s *ProgressService) UpdateGame(id string, name, status *string, rating *int, review *string, steamAppID *int, steamIconURL, steamStoreURL *string, steamPlaytimeForever *int) (*models.Progress, error) {
	progress, err := s.progressRepository.GetByID(id)
	if err != nil {
		return nil, err
	}

	oldStatus := progress.Status
	if name != nil {
		progress.Name = *name
	}
	if status != nil {
		progress.Status = models.GameStatus(*status)
	}
	if rating != nil {
		progress.Rating = rating
	}
	if review != nil {
		progress.Review = *review
	}
	if steamAppID != nil {
		progress.SteamAppID = steamAppID
	}
	if steamIconURL != nil {
		progress.SteamIconURL = *steamIconURL
	}
	if steamStoreURL != nil {
		progress.SteamStoreURL = *steamStoreURL
	}
	if steamPlaytimeForever != nil {
		progress.SteamPlaytimeForever = steamPlaytimeForever
	}

	if err := s.progressRepository.Update(progress); err != nil {
		return nil, err
	}

	if status != nil && oldStatus != progress.Status {
		activity := &models.Activity{
			ID:         uuid.New().String(),
			UserID:     progress.UserID,
			Type:       models.ActivityTypeUpdateStatus,
			ProgressID: &progress.ID,
			GameName:   &progress.Name,
			Status:     &progress.Status,
		}
		s.activityRepository.Create(activity)
	} else if rating != nil || review != nil {
		activity := &models.Activity{
			ID:         uuid.New().String(),
			UserID:     progress.UserID,
			Type:       models.ActivityTypeRateGame,
			ProgressID: &progress.ID,
			GameName:   &progress.Name,
			Rating:     rating,
		}
		s.activityRepository.Create(activity)
	}

	return progress, nil
}

func (s *ProgressService) DeleteGame(id string) error {
	s.activityRepository.DeleteByProgressID(id)
	return s.progressRepository.Delete(id)
}

func (s *ProgressService) GetUserGames(userID string) ([]*models.Progress, error) {
	return s.progressRepository.GetByUserID(userID)
}

func (s *ProgressService) GetGameByID(id string) (*models.Progress, error) {
	return s.progressRepository.GetByID(id)
}

func (s *ProgressService) UpdateSteamData(id string, steamAppID *int, steamIconURL string, steamPlaytimeForever *int, steamStoreURL string) (*models.Progress, error) {
	progress, err := s.progressRepository.GetByID(id)
	if err != nil {
		return nil, err
	}

	progress.SteamAppID = steamAppID
	progress.SteamIconURL = steamIconURL
	progress.SteamPlaytimeForever = steamPlaytimeForever
	progress.SteamStoreURL = steamStoreURL

	if err := s.progressRepository.Update(progress); err != nil {
		return nil, err
	}

	return progress, nil
}
