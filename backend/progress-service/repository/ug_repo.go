package repository

import (
	"github.com/darkfated/gamecheck/backend/progress-service/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type UGRepo struct {
	DB *gorm.DB
}

func NewUGRepo(db *gorm.DB) *UGRepo {
	return &UGRepo{DB: db}
}

func (r *UGRepo) Upsert(ug *model.UserGame) error {
	return r.DB.
		Clauses(clause.OnConflict{UpdateAll: true}).
		Create(ug).Error
}

func (r *UGRepo) GetByUser(userID string) ([]model.UserGame, error) {
	var list []model.UserGame
	err := r.DB.Where("user_id = ?", userID).Find(&list).Error
	return list, err
}

func (r *UGRepo) Delete(userID uuid.UUID, gameID uuid.UUID) error {
	return r.DB.Where("user_id = ? AND game_id = ?", userID, gameID).Delete(&model.UserGame{}).Error
}

// GetAverageRating возвращает среднюю оценку игры и количество оценок
func (r *UGRepo) GetAverageRating(gameID string) (float64, int64, error) {
	var avgRating float64
	var count int64

	err := r.DB.Model(&model.UserGame{}).
		Select("COALESCE(AVG(rating), 0) as avg_rating, COUNT(*) as count").
		Where("game_id = ? AND rating > 0", gameID).
		Row().
		Scan(&avgRating, &count)

	return avgRating, count, err
}
