package service

import (
	"bytes"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"

	"github.com/darkfated/gamecheck/backend/progress-service/model"
	"github.com/darkfated/gamecheck/backend/progress-service/repository"
)

type ProgressService struct {
	Repo           *repository.UGRepo
	GameServiceURL string
}

func NewProgressService(r *repository.UGRepo, gameURL string) *ProgressService {
	return &ProgressService{Repo: r, GameServiceURL: gameURL}
}

func (s *ProgressService) UpsertProgress(ug *model.UserGame) error {
	if err := s.Repo.Upsert(ug); err != nil {
		return err
	}
	// уведомляем GameService пересчитать рейтинг
	go func() {
		url := fmt.Sprintf("%s/v1/games/%s/recalc-rating", s.GameServiceURL, ug.GameID.String())
		client := &http.Client{Timeout: 5 * time.Second}
		req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(nil))
		if err != nil {
			fmt.Printf("Error creating request: %v\n", err)
			return
		}
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("Error sending request to game service: %v\n", err)
			return
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			fmt.Printf("Game service returned non-OK status: %d\n", resp.StatusCode)
		}
	}()
	return nil
}

func (s *ProgressService) GetUserProgress(userID string) ([]model.UserGame, error) {
	return s.Repo.GetByUser(userID)
}

func (s *ProgressService) DeleteProgress(userID uuid.UUID, gameID uuid.UUID) error {
	if err := s.Repo.Delete(userID, gameID); err != nil {
		return err
	}

	// Уведомляем GameService о необходимости пересчитать рейтинг
	go func() {
		url := fmt.Sprintf("%s/v1/games/%s/recalc-rating", s.GameServiceURL, gameID.String())
		client := &http.Client{Timeout: 5 * time.Second}
		req, err := http.NewRequest(http.MethodPut, url, bytes.NewBuffer(nil))
		if err != nil {
			fmt.Printf("Error creating request: %v\n", err)
			return
		}
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("Error sending request to game service: %v\n", err)
			return
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			fmt.Printf("Game service returned non-OK status: %d\n", resp.StatusCode)
		}
	}()

	return nil
}

// GetGameRating возвращает среднюю оценку игры и количество оценок
func (s *ProgressService) GetGameRating(gameID string) (float64, int64, error) {
	return s.Repo.GetAverageRating(gameID)
}
