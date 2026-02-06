package services

import (
	"errors"
	"log"
	"regexp"
	"strings"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"

	"gorm.io/gorm"
)

type LibraryGameResponse struct {
	models.LibraryGame
	AverageRating float64 `json:"averageRating"`
	RatingsCount  int     `json:"ratingsCount"`
	ReviewsCount  int     `json:"reviewsCount"`
	ProgressCount int     `json:"progressCount"`
}

type LibraryGameDetailResponse struct {
	LibraryGameResponse
	Comments []repositories.LibraryComment `json:"comments"`
}

type LibraryService struct {
	libraryRepository *repositories.LibraryRepository
	steamService      *SteamService
}

func NewLibraryService(
	libraryRepo *repositories.LibraryRepository,
	steamService *SteamService,
) *LibraryService {
	return &LibraryService{
		libraryRepository: libraryRepo,
		steamService:      steamService,
	}
}

func (s *LibraryService) EnsureLibraryGameFromSteam(appID int) (*models.LibraryGame, error) {
	if appID <= 0 {
		return nil, nil
	}

	existing, err := s.libraryRepository.GetBySteamAppID(appID)
	if err == nil && existing != nil {
		return existing, nil
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	details, err := s.steamService.GetStoreDetails(appID)
	if err != nil {
		return nil, err
	}

	primaryGenre := ""
	if len(details.Genres) > 0 {
		primaryGenre = details.Genres[0]
	}

	tags := mergeUnique(details.Genres, details.Categories)

	game := &models.LibraryGame{
		SteamAppID:       details.AppID,
		Name:             details.Name,
		ShortDescription: stripHTML(details.ShortDescription),
		Description:      stripHTML(details.Description),
		HeaderImage:      details.HeaderImage,
		CapsuleImage:     details.CapsuleImage,
		BackgroundImage:  details.BackgroundImage,
		StoreURL:         details.StoreURL,
		PrimaryGenre:     primaryGenre,
		Genres:           details.Genres,
		Categories:       details.Categories,
		Tags:             tags,
	}

	if err := s.libraryRepository.Upsert(game); err != nil {
		return nil, err
	}
	return game, nil
}

func (s *LibraryService) ListGames(limit, offset int, search, genre, sort, order string) ([]LibraryGameResponse, int64, error) {
	rows, err := s.libraryRepository.ListWithStats(limit, offset, search, genre, sort, order)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.libraryRepository.Count(search, genre)
	if err != nil {
		return nil, 0, err
	}

	results := make([]LibraryGameResponse, 0, len(rows))
	for _, row := range rows {
		results = append(results, LibraryGameResponse{
			LibraryGame:   row.LibraryGame,
			AverageRating: row.AverageRating,
			RatingsCount:  row.RatingsCount,
			ReviewsCount:  row.ReviewsCount,
			ProgressCount: row.ProgressCount,
		})
	}

	return results, total, nil
}

func (s *LibraryService) GetGameByID(id string, commentsLimit, commentsOffset int) (*LibraryGameDetailResponse, error) {
	row, err := s.libraryRepository.GetWithStatsByID(id)
	if err != nil {
		return nil, err
	}

	comments, err := s.libraryRepository.GetCommentsBySteamAppID(row.SteamAppID, commentsLimit, commentsOffset)
	if err != nil {
		return nil, err
	}

	return &LibraryGameDetailResponse{
		LibraryGameResponse: LibraryGameResponse{
			LibraryGame:   row.LibraryGame,
			AverageRating: row.AverageRating,
			RatingsCount:  row.RatingsCount,
			ReviewsCount:  row.ReviewsCount,
			ProgressCount: row.ProgressCount,
		},
		Comments: comments,
	}, nil
}

func (s *LibraryService) GetGameByAppID(appID int, commentsLimit, commentsOffset int) (*LibraryGameDetailResponse, error) {
	if appID <= 0 {
		return nil, gorm.ErrRecordNotFound
	}

	if _, err := s.EnsureLibraryGameFromSteam(appID); err != nil {
		return nil, err
	}

	row, err := s.libraryRepository.GetWithStatsBySteamAppID(appID)
	if err != nil {
		return nil, err
	}

	comments, err := s.libraryRepository.GetCommentsBySteamAppID(row.SteamAppID, commentsLimit, commentsOffset)
	if err != nil {
		return nil, err
	}

	return &LibraryGameDetailResponse{
		LibraryGameResponse: LibraryGameResponse{
			LibraryGame:   row.LibraryGame,
			AverageRating: row.AverageRating,
			RatingsCount:  row.RatingsCount,
			ReviewsCount:  row.ReviewsCount,
			ProgressCount: row.ProgressCount,
		},
		Comments: comments,
	}, nil
}

func (s *LibraryService) WarmLibraryFromProgress(appID int) {
	if appID <= 0 {
		return
	}
	if _, err := s.EnsureLibraryGameFromSteam(appID); err != nil {
		log.Printf("failed to ensure library game for app %d: %v", appID, err)
	}
}

func mergeUnique(primary []string, secondary []string) []string {
	seen := make(map[string]struct{})
	var out []string
	appendTag := func(tag string) {
		tag = strings.TrimSpace(tag)
		if tag == "" {
			return
		}
		key := strings.ToLower(tag)
		if _, exists := seen[key]; exists {
			return
		}
		seen[key] = struct{}{}
		out = append(out, tag)
	}

	for _, tag := range primary {
		appendTag(tag)
	}
	for _, tag := range secondary {
		appendTag(tag)
	}
	return out
}

var htmlTagRegexp = regexp.MustCompile(`<[^>]+>`)

func stripHTML(value string) string {
	if value == "" {
		return value
	}
	return strings.TrimSpace(htmlTagRegexp.ReplaceAllString(value, ""))
}
