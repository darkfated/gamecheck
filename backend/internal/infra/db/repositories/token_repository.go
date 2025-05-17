package repositories

import (
	"context"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"

	"gorm.io/gorm"
)

// TokenRepositoryImpl реализация репозитория токенов
type TokenRepositoryImpl struct {
	db *gorm.DB
}

// NewTokenRepository создает новый экземпляр репозитория токенов
func NewTokenRepository(db *gorm.DB) repositories.TokenRepository {
	return &TokenRepositoryImpl{db: db}
}

// CreateToken создает новый токен в базе данных
func (r *TokenRepositoryImpl) CreateToken(ctx context.Context, token *models.Token) error {
	return r.db.WithContext(ctx).Create(token).Error
}

// DeleteToken удаляет токен по его значению
func (r *TokenRepositoryImpl) DeleteToken(ctx context.Context, tokenString string) error {
	return r.db.WithContext(ctx).
		Where("token = ?", tokenString).
		Delete(&models.Token{}).Error
}

// DeleteUserTokens удаляет все токены пользователя
func (r *TokenRepositoryImpl) DeleteUserTokens(ctx context.Context, userID string) error {
	return r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Delete(&models.Token{}).Error
}

// GetTokenByValue ищет токен по его значению
func (r *TokenRepositoryImpl) GetTokenByValue(ctx context.Context, tokenString string) (*models.Token, error) {
	var token models.Token
	err := r.db.WithContext(ctx).
		Where("token = ?", tokenString).
		First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}
