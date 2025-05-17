package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"gamecheck/config"
	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AuthService предоставляет методы для работы с аутентификацией
type AuthService struct {
	config       *config.Config
	userRepo     repositories.UserRepository
	tokenRepo    repositories.TokenRepository
	activityRepo repositories.ActivityRepository
}

// NewAuthService создает новый экземпляр сервиса аутентификации
func NewAuthService(
	config *config.Config,
	userRepo repositories.UserRepository,
	tokenRepo repositories.TokenRepository,
	activityRepo repositories.ActivityRepository,
) *AuthService {
	return &AuthService{
		config:       config,
		userRepo:     userRepo,
		tokenRepo:    tokenRepo,
		activityRepo: activityRepo,
	}
}

// AuthenticateWithSteam аутентифицирует пользователя через Steam
func (s *AuthService) AuthenticateWithSteam(ctx context.Context, steamID, displayName, avatarURL, profileURL string) (string, error) {
	user, err := s.userRepo.GetUserBySteamID(ctx, steamID)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", fmt.Errorf("ошибка при поиске пользователя: %w", err)
	}

	// Если пользователь не существует или возникла ошибка "запись не найдена", создаем нового
	if user == nil || errors.Is(err, gorm.ErrRecordNotFound) {
		user = &models.User{
			ID:          uuid.New().String(),
			SteamID:     steamID,
			DisplayName: displayName,
			AvatarURL:   avatarURL,
			ProfileURL:  profileURL,
		}
		if err := s.userRepo.CreateUser(ctx, user); err != nil {
			return "", fmt.Errorf("ошибка при создании пользователя: %w", err)
		}
	} else {
		// Обновляем информацию о пользователе
		user.DisplayName = displayName
		user.AvatarURL = avatarURL
		user.ProfileURL = profileURL
		user.LastLoginAt = time.Now()
		if err := s.userRepo.UpdateUser(ctx, user); err != nil {
			return "", fmt.Errorf("ошибка при обновлении пользователя: %w", err)
		}
	}

	token, err := s.GenerateToken(ctx, user.ID)
	if err != nil {
		return "", fmt.Errorf("ошибка при генерации токена: %w", err)
	}

	return token, nil
}

// GenerateToken генерирует JWT токен для пользователя
func (s *AuthService) GenerateToken(ctx context.Context, userID string) (string, error) {
	expiresAt := time.Now().Add(s.config.JWT.ExpiresIn)
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     expiresAt.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.config.JWT.Secret))
	if err != nil {
		return "", fmt.Errorf("ошибка при подписании токена: %w", err)
	}

	dbToken := &models.Token{
		UserID:    userID,
		Token:     tokenString,
		ExpiresAt: expiresAt,
	}
	if err := s.tokenRepo.CreateToken(ctx, dbToken); err != nil {
		return "", fmt.Errorf("ошибка при сохранении токена: %w", err)
	}

	return tokenString, nil
}

// ValidateToken проверяет валидность JWT токена
func (s *AuthService) ValidateToken(ctx context.Context, tokenString string) (*models.User, error) {
	dbToken, err := s.tokenRepo.GetTokenByValue(ctx, tokenString)
	if err != nil {
		return nil, errors.New("токен не найден")
	}

	// Проверяем срок действия токена
	if time.Now().After(dbToken.ExpiresAt) {
		_ = s.tokenRepo.DeleteToken(ctx, tokenString)
		return nil, errors.New("токен истек")
	}

	// Проверяем JWT токен
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("неожиданный метод подписи: %v", token.Header["alg"])
		}
		return []byte(s.config.JWT.Secret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("ошибка при проверке токена: %w", err)
	}

	if !token.Valid {
		return nil, errors.New("недействительный токен")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("недействительные данные токена")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return nil, errors.New("недействительный ID пользователя в токене")
	}

	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("ошибка при получении пользователя: %w", err)
	}

	return user, nil
}

// Logout выполняет выход пользователя из системы
func (s *AuthService) Logout(ctx context.Context, tokenString string) error {
	return s.tokenRepo.DeleteToken(ctx, tokenString)
}
