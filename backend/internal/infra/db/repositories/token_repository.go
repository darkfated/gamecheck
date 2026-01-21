package repositories

import (
	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
)

type TokenRepository struct {
	db *gorm.DB
}

func NewTokenRepository(db *gorm.DB) *TokenRepository {
	return &TokenRepository{db: db}
}

func (r *TokenRepository) Create(token *models.Token) error {
	return r.db.Create(token).Error
}

func (r *TokenRepository) GetByToken(token string) (*models.Token, error) {
	var t models.Token
	if err := r.db.First(&t, "token = ?", token).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TokenRepository) GetByUserID(userID string) (*models.Token, error) {
	var t models.Token
	if err := r.db.First(&t, "user_id = ?", userID).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TokenRepository) Delete(id string) error {
	return r.db.Delete(&models.Token{}, "id = ?", id).Error
}

func (r *TokenRepository) DeleteByUserID(userID string) error {
	return r.db.Delete(&models.Token{}, "user_id = ?", userID).Error
}
