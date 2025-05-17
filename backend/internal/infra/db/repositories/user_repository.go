package repositories

import (
	"context"
	"fmt"
	"strings"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"

	"gorm.io/gorm"
)

// UserRepositoryImpl реализация репозитория пользователей
type UserRepositoryImpl struct {
	db *gorm.DB
}

// NewUserRepository создает новый экземпляр репозитория пользователей
func NewUserRepository(db *gorm.DB) repositories.UserRepository {
	return &UserRepositoryImpl{db: db}
}

// CreateUser создает нового пользователя
func (r *UserRepositoryImpl) CreateUser(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

// UpdateUser обновляет существующего пользователя
func (r *UserRepositoryImpl) UpdateUser(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).Model(user).Updates(user).Error
}

// GetUserByID получает пользователя по ID
func (r *UserRepositoryImpl) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("пользователь не найден с ID: %s", id)
		}
		return nil, err
	}
	return &user, nil
}

// GetUserBySteamID получает пользователя по Steam ID
func (r *UserRepositoryImpl) GetUserBySteamID(ctx context.Context, steamID string) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).Where("steam_id = ?", steamID).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, gorm.ErrRecordNotFound // Возвращаем ошибку gorm.ErrRecordNotFound вместо nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// SearchUsers ищет пользователей по части имени
func (r *UserRepositoryImpl) SearchUsers(ctx context.Context, query string) ([]*models.User, error) {
	var users []*models.User

	searchQuery := "%" + strings.ToLower(query) + "%"

	err := r.db.WithContext(ctx).
		Where("LOWER(display_name) LIKE ?", searchQuery).
		Order("display_name ASC").
		Limit(20).
		Find(&users).Error

	if err != nil {
		return nil, err
	}

	return users, nil
}

// IsFollowing проверяет, подписан ли пользователь followerID на пользователя followingID
func (r *UserRepositoryImpl) IsFollowing(ctx context.Context, followerID, followingID string) (bool, error) {
	var count int64

	err := r.db.WithContext(ctx).
		Model(&models.Subscription{}).
		Where("follower_id = ? AND following_id = ?", followerID, followingID).
		Count(&count).Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

// CountFollowers подсчитывает количество подписчиков у пользователя
func (r *UserRepositoryImpl) CountFollowers(ctx context.Context, userID string) (int, error) {
	var count int64

	err := r.db.WithContext(ctx).
		Model(&models.Subscription{}).
		Where("following_id = ?", userID).
		Count(&count).Error

	if err != nil {
		return 0, err
	}

	return int(count), nil
}

// CountFollowing подсчитывает количество подписок пользователя
func (r *UserRepositoryImpl) CountFollowing(ctx context.Context, userID string) (int, error) {
	var count int64

	err := r.db.WithContext(ctx).
		Model(&models.Subscription{}).
		Where("follower_id = ?", userID).
		Count(&count).Error

	if err != nil {
		return 0, err
	}

	return int(count), nil
}
