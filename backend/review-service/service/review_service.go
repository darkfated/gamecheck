package service

import (
	"bytes"
	"fmt"
	"net/http"
	"time"

	"github.com/darkfated/gamecheck/backend/review-service/model"
	"github.com/darkfated/gamecheck/backend/review-service/repository"
	"github.com/google/uuid"
)

type ReviewService struct {
	Repo           *repository.ReviewRepo
	GameServiceURL string
}

func NewReviewService(r *repository.ReviewRepo, gameURL string) *ReviewService {
	return &ReviewService{Repo: r, GameServiceURL: gameURL}
}

func (s *ReviewService) CreateReview(r *model.Review) error {
	if err := s.Repo.Create(r); err != nil {
		return err
	}

	// Уведомляем game-service о необходимости пересчитать рейтинг
	go s.notifyGameService(r.GameID)
	return nil
}

func (s *ReviewService) GetApproved(gameID string) ([]model.Review, error) {
	return s.Repo.ListApproved(gameID)
}

func (s *ReviewService) GetAll(gameID string) ([]model.Review, error) {
	return s.Repo.ListAll(gameID)
}

func (s *ReviewService) GetByID(id uuid.UUID) (*model.Review, error) {
	return s.Repo.GetByID(id)
}

func (s *ReviewService) GetByUser(userID uuid.UUID) ([]model.Review, error) {
	return s.Repo.ListByUser(userID)
}

func (s *ReviewService) UpdateReview(r *model.Review) error {
	if err := s.Repo.Update(r); err != nil {
		return err
	}
	// Уведомляем game-service о необходимости пересчитать рейтинг
	go s.notifyGameService(r.GameID)
	return nil
}

func (s *ReviewService) DeleteReview(id uuid.UUID) error {
	// Получаем информацию о отзыве перед удалением
	review, err := s.Repo.GetByID(id)
	if err != nil {
		return err
	}

	// Запоминаем ID игры для уведомления
	gameID := review.GameID

	// Удаляем отзыв
	if err := s.Repo.Delete(id); err != nil {
		return err
	}

	// Уведомляем game-service о необходимости пересчитать рейтинг
	go s.notifyGameService(gameID)
	return nil
}

// GetGameRating возвращает среднюю оценку игры и количество оценок
func (s *ReviewService) GetGameRating(gameID string) (float64, int64, error) {
	return s.Repo.GetAverageRating(gameID)
}

// notifyGameService уведомляет game-service о необходимости пересчитать рейтинг
func (s *ReviewService) notifyGameService(gameID uuid.UUID) {
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

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		fmt.Printf("Game service returned non-success status: %d\n", resp.StatusCode)
	}
}
