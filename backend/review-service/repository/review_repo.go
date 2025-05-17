package repository

import (
	"github.com/darkfated/gamecheck/backend/review-service/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ReviewRepo struct {
	DB *gorm.DB
}

func NewReviewRepo(db *gorm.DB) *ReviewRepo {
	return &ReviewRepo{DB: db}
}

func (r *ReviewRepo) Create(rv *model.Review) error {
	// При создании автоматически подтверждаем отзыв
	rv.Status = "approved"
	return r.DB.Create(rv).Error
}

func (r *ReviewRepo) ListApproved(gameID string) ([]model.Review, error) {
	var list []model.Review
	err := r.DB.Where("game_id = ? AND status = ?", gameID, "approved").Find(&list).Error
	return list, err
}

func (r *ReviewRepo) ListAll(gameID string) ([]model.Review, error) {
	var list []model.Review
	err := r.DB.Where("game_id = ?", gameID).Find(&list).Error
	return list, err
}

func (r *ReviewRepo) GetByID(reviewID uuid.UUID) (*model.Review, error) {
	var review model.Review
	err := r.DB.Where("id = ?", reviewID).First(&review).Error
	if err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *ReviewRepo) Update(review *model.Review) error {
	return r.DB.Save(review).Error
}

func (r *ReviewRepo) Delete(reviewID uuid.UUID) error {
	return r.DB.Where("id = ?", reviewID).Delete(&model.Review{}).Error
}

func (r *ReviewRepo) ListByUser(userID uuid.UUID) ([]model.Review, error) {
	var reviews []model.Review
	err := r.DB.Where("user_id = ?", userID).Find(&reviews).Error
	return reviews, err
}

// GetAverageRating возвращает среднюю оценку игры и количество оценок
func (r *ReviewRepo) GetAverageRating(gameID string) (float64, int64, error) {
	var avgRating float64
	var count int64

	err := r.DB.Model(&model.Review{}).
		Select("COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as count").
		Where("game_id = ? AND rating > 0", gameID).
		Row().
		Scan(&avgRating, &count)

	return avgRating, count, err
}
