package services

import (
	"strings"
	"time"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"

	"github.com/google/uuid"
)

type ProgressGameResponse struct {
	ID                   string            `json:"id"`
	UserID               string            `json:"userId"`
	Name                 string            `json:"name"`
	Status               models.GameStatus `json:"status"`
	Rating               *int              `json:"rating,omitempty"`
	Review               string            `json:"review,omitempty"`
	SteamAppID           *int              `json:"steamAppId,omitempty"`
	SteamIconURL         string            `json:"steamIconUrl,omitempty"`
	SteamStoreURL        string            `json:"steamStoreUrl,omitempty"`
	SteamPlaytimeForever *int              `json:"steamPlaytimeForever,omitempty"`
	CreatedAt            time.Time         `json:"createdAt"`
	UpdatedAt            time.Time         `json:"updatedAt"`
}

type ProgressSummary struct {
	Total       int            `json:"total"`
	AvgRating   float64        `json:"avgRating"`
	RatingCount int            `json:"ratingCount"`
	ByStatus    map[string]int `json:"byStatus"`
}

type ProgressPageResponse struct {
	Data    []*ProgressGameResponse `json:"data"`
	Total   int64                   `json:"total"`
	Limit   int                     `json:"limit"`
	Offset  int                     `json:"offset"`
	Summary *ProgressSummary        `json:"summary,omitempty"`
}

type ProgressService struct {
	progressRepository *repositories.ProgressRepository
	activityRepository *repositories.ActivityRepository
	steamService       *SteamService
	libraryService     *LibraryService
}

func NewProgressService(
	progressRepo *repositories.ProgressRepository,
	activityRepo *repositories.ActivityRepository,
	steamService *SteamService,
	libraryService *LibraryService,
) *ProgressService {
	return &ProgressService{
		progressRepository: progressRepo,
		activityRepository: activityRepo,
		steamService:       steamService,
		libraryService:     libraryService,
	}
}

func (s *ProgressService) AddGame(userID, name, status string, rating *int, review string) (*ProgressGameResponse, error) {
	return s.AddGameWithSteamData(userID, name, status, rating, review, nil, nil)
}

func (s *ProgressService) AddGameWithSteamData(
	userID, name, status string,
	rating *int,
	review string,
	steamAppID *int,
	steamPlaytimeForever *int,
) (*ProgressGameResponse, error) {
	gameStatus := models.GameStatus(status)

	nameToStore := name
	activityName := name
	var libraryGame *models.LibraryGame

	if steamAppID != nil && s.libraryService != nil {
		if lg, err := s.libraryService.EnsureLibraryGameFromSteam(*steamAppID); err == nil && lg != nil {
			libraryGame = lg
			if strings.TrimSpace(lg.Name) != "" {
				activityName = lg.Name
				nameToStore = ""
			}
		}
	}

	progress := &models.Progress{
		ID:                   uuid.New().String(),
		UserID:               userID,
		Name:                 nameToStore,
		Status:               gameStatus,
		Rating:               rating,
		Review:               review,
		SteamAppID:           steamAppID,
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
		GameName:   &activityName,
		Status:     &progress.Status,
		Rating:     rating,
	}
	s.activityRepository.Create(activity)

	if steamAppID != nil && s.libraryService != nil && libraryGame == nil {
		s.libraryService.WarmLibraryFromProgress(*steamAppID)
	}

	return s.getProgressView(progress.ID)
}

func (s *ProgressService) UpdateGame(
	id string,
	name, status *string,
	rating *int,
	review *string,
	steamAppID *int,
	steamPlaytimeForever *int,
) (*ProgressGameResponse, error) {
	progress, err := s.progressRepository.GetByID(id)
	if err != nil {
		return nil, err
	}

	oldStatus := progress.Status
	if name != nil && progress.SteamAppID == nil && steamAppID == nil {
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
	if steamPlaytimeForever != nil {
		progress.SteamPlaytimeForever = steamPlaytimeForever
	}

	var libraryGame *models.LibraryGame
	if progress.SteamAppID != nil && s.libraryService != nil {
		if lg, err := s.libraryService.EnsureLibraryGameFromSteam(*progress.SteamAppID); err == nil && lg != nil {
			libraryGame = lg
			if strings.TrimSpace(lg.Name) != "" {
				progress.Name = ""
			}
		}
	}

	if err := s.progressRepository.Update(progress); err != nil {
		return nil, err
	}

	activityName := progress.Name
	if libraryGame != nil && strings.TrimSpace(libraryGame.Name) != "" {
		activityName = libraryGame.Name
	} else if activityName == "" && name != nil {
		activityName = *name
	}

	if status != nil && oldStatus != progress.Status {
		activity := &models.Activity{
			ID:         uuid.New().String(),
			UserID:     progress.UserID,
			Type:       models.ActivityTypeUpdateStatus,
			ProgressID: &progress.ID,
			GameName:   &activityName,
			Status:     &progress.Status,
		}
		s.activityRepository.Create(activity)
	} else if rating != nil || review != nil {
		activity := &models.Activity{
			ID:         uuid.New().String(),
			UserID:     progress.UserID,
			Type:       models.ActivityTypeRateGame,
			ProgressID: &progress.ID,
			GameName:   &activityName,
			Rating:     rating,
		}
		s.activityRepository.Create(activity)
	}

	return s.getProgressView(progress.ID)
}

func (s *ProgressService) DeleteGame(id string) error {
	s.activityRepository.DeleteByProgressID(id)
	return s.progressRepository.Delete(id)
}

func (s *ProgressService) GetUserGamesPage(userID, status string, limit, offset int, includeSummary bool) (*ProgressPageResponse, error) {
	var rows []repositories.ProgressRow
	if limit > 0 {
		var err error
		rows, err = s.progressRepository.ListWithLibraryByUserID(userID, status, limit, offset)
		if err != nil {
			return nil, err
		}
	}

	total, err := s.progressRepository.CountByUserID(userID, status)
	if err != nil {
		return nil, err
	}

	results := make([]*ProgressGameResponse, 0, len(rows))
	for i := range rows {
		results = append(results, mapProgressRow(&rows[i]))
	}

	response := &ProgressPageResponse{
		Data:   results,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	}

	if includeSummary {
		stats, err := s.progressRepository.GetStatsByUserID(userID)
		if err != nil {
			return nil, err
		}
		summary := &ProgressSummary{
			Total:       int(stats.Total),
			AvgRating:   stats.AvgRating,
			RatingCount: int(stats.RatingCount),
			ByStatus:    make(map[string]int),
		}
		for key, value := range stats.ByStatus {
			summary.ByStatus[key] = int(value)
		}
		response.Summary = summary
	}

	return response, nil
}

func (s *ProgressService) GetGameByID(id string) (*models.Progress, error) {
	return s.progressRepository.GetByID(id)
}

func (s *ProgressService) UpdateSteamData(id string, steamAppID *int, steamPlaytimeForever *int) (*ProgressGameResponse, error) {
	progress, err := s.progressRepository.GetByID(id)
	if err != nil {
		return nil, err
	}

	if steamAppID != nil {
		progress.SteamAppID = steamAppID
	}
	if steamPlaytimeForever != nil {
		progress.SteamPlaytimeForever = steamPlaytimeForever
	}

	if progress.SteamAppID != nil && s.libraryService != nil {
		if lg, err := s.libraryService.EnsureLibraryGameFromSteam(*progress.SteamAppID); err == nil && lg != nil {
			if strings.TrimSpace(lg.Name) != "" {
				progress.Name = ""
			}
		}
	}

	if err := s.progressRepository.Update(progress); err != nil {
		return nil, err
	}

	return s.getProgressView(progress.ID)
}

func (s *ProgressService) ExistsForUser(userID string, steamAppID *int, name string) (bool, error) {
	if steamAppID != nil {
		exists, err := s.progressRepository.ExistsByUserIDAndSteamAppID(userID, *steamAppID)
		if err != nil {
			return false, err
		}
		if exists {
			return true, nil
		}
	}

	trimmed := strings.TrimSpace(name)
	if trimmed == "" {
		return false, nil
	}
	return s.progressRepository.ExistsByUserIDAndName(userID, trimmed)
}

func (s *ProgressService) getProgressView(id string) (*ProgressGameResponse, error) {
	row, err := s.progressRepository.GetWithLibraryByID(id)
	if err != nil {
		return nil, err
	}
	return mapProgressRow(row), nil
}

func mapProgressRow(row *repositories.ProgressRow) *ProgressGameResponse {
	if row == nil {
		return nil
	}
	return &ProgressGameResponse{
		ID:                   row.ID,
		UserID:               row.UserID,
		Name:                 row.Name,
		Status:               row.Status,
		Rating:               row.Rating,
		Review:               row.Review,
		SteamAppID:           row.SteamAppID,
		SteamIconURL:         row.SteamIconURL,
		SteamStoreURL:        row.SteamStoreURL,
		SteamPlaytimeForever: row.SteamPlaytimeForever,
		CreatedAt:            row.CreatedAt,
		UpdatedAt:            row.UpdatedAt,
	}
}
