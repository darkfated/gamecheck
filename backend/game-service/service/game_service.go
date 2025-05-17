package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/darkfated/gamecheck/backend/game-service/repository"
)

type GameService struct {
	Repo *repository.GameRepo
}

type progressRating struct {
	GameID string  `json:"game_id"`
	Rating float64 `json:"avg_rating"`
	Count  int     `json:"count"`
}

type reviewRating struct {
	GameID string  `json:"game_id"`
	Rating float64 `json:"avg_rating"`
	Count  int     `json:"count"`
}

func NewGameService(r *repository.GameRepo) *GameService {
	return &GameService{Repo: r}
}

// RecalcRating собирает оценки из сервисов Progress и Review
// и пересчитывает средний рейтинг игры
func (s *GameService) RecalcRating(id string) error {
	var totalRating float64
	var totalCount int

	// Получаем оценки из сервиса прогресса
	progressRatings, err := s.fetchProgressRatings(id)
	if err != nil {
		// Если не удалось получить, просто логируем ошибку, не прерываем работу
		fmt.Printf("Error fetching progress ratings: %v\n", err)
	} else {
		totalRating += progressRatings.Rating * float64(progressRatings.Count)
		totalCount += progressRatings.Count
	}

	// Получаем оценки из сервиса отзывов
	reviewRatings, err := s.fetchReviewRatings(id)
	if err != nil {
		// Если не удалось получить, просто логируем ошибку, не прерываем работу
		fmt.Printf("Error fetching review ratings: %v\n", err)
	} else {
		totalRating += reviewRatings.Rating * float64(reviewRatings.Count)
		totalCount += reviewRatings.Count
	}

	// Если нет оценок, просто возвращаем nil
	if totalCount == 0 {
		return nil
	}

	// Вычисляем средний рейтинг
	avgRating := totalRating / float64(totalCount)

	// Получаем объект игры
	game, err := s.Repo.GetByID(id)
	if err != nil {
		return err
	}

	// Обновляем рейтинг
	game.AvgRating = avgRating
	return s.Repo.Update(game)
}

// fetchProgressRatings получает данные из сервиса прогресса
func (s *GameService) fetchProgressRatings(gameID string) (*progressRating, error) {
	progressServiceURL := os.Getenv("PROGRESS_SERVICE_URL")
	if progressServiceURL == "" {
		progressServiceURL = "http://localhost:8083" // URL по умолчанию
	}

	resp, err := http.Get(fmt.Sprintf("%s/v1/games/%s/ratings", progressServiceURL, gameID))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received non-200 response: %d", resp.StatusCode)
	}

	var result progressRating
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}

// fetchReviewRatings получает данные из сервиса отзывов
func (s *GameService) fetchReviewRatings(gameID string) (*reviewRating, error) {
	reviewServiceURL := os.Getenv("REVIEW_SERVICE_URL")
	if reviewServiceURL == "" {
		reviewServiceURL = "http://localhost:8084" // URL по умолчанию
	}

	resp, err := http.Get(fmt.Sprintf("%s/v1/games/%s/ratings", reviewServiceURL, gameID))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received non-200 response: %d", resp.StatusCode)
	}

	var result reviewRating
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}
