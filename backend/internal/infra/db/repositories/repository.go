package repositories

import (
	"context"

	"gamecheck/internal/domain/models"
	"gamecheck/internal/domain/repositories"
)

// RepositoryImpl реализация композитного репозитория
type RepositoryImpl struct {
	userRepo         repositories.UserRepository
	progressRepo     repositories.ProgressRepository
	activityRepo     repositories.ActivityRepository
	subscriptionRepo repositories.SubscriptionRepository
	tokenRepo        repositories.TokenRepository
}

// NewRepository создает новый экземпляр композитного репозитория
func NewRepository(
	userRepo repositories.UserRepository,
	progressRepo repositories.ProgressRepository,
	activityRepo repositories.ActivityRepository,
	subscriptionRepo repositories.SubscriptionRepository,
	tokenRepo repositories.TokenRepository,
) repositories.Repository {
	return &RepositoryImpl{
		userRepo:         userRepo,
		progressRepo:     progressRepo,
		activityRepo:     activityRepo,
		subscriptionRepo: subscriptionRepo,
		tokenRepo:        tokenRepo,
	}
}

// Методы UserRepository
func (r *RepositoryImpl) CreateUser(ctx context.Context, user *models.User) error {
	return r.userRepo.CreateUser(ctx, user)
}

func (r *RepositoryImpl) UpdateUser(ctx context.Context, user *models.User) error {
	return r.userRepo.UpdateUser(ctx, user)
}

func (r *RepositoryImpl) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	return r.userRepo.GetUserByID(ctx, id)
}

func (r *RepositoryImpl) GetUserBySteamID(ctx context.Context, steamID string) (*models.User, error) {
	return r.userRepo.GetUserBySteamID(ctx, steamID)
}

func (r *RepositoryImpl) SearchUsers(ctx context.Context, query string) ([]*models.User, error) {
	return r.userRepo.SearchUsers(ctx, query)
}

func (r *RepositoryImpl) IsFollowing(ctx context.Context, followerID, followingID string) (bool, error) {
	return r.userRepo.IsFollowing(ctx, followerID, followingID)
}

func (r *RepositoryImpl) CountFollowers(ctx context.Context, userID string) (int, error) {
	return r.userRepo.CountFollowers(ctx, userID)
}

func (r *RepositoryImpl) CountFollowing(ctx context.Context, userID string) (int, error) {
	return r.userRepo.CountFollowing(ctx, userID)
}

// Методы ProgressRepository
func (r *RepositoryImpl) CreateProgress(ctx context.Context, progress *models.Progress) error {
	return r.progressRepo.CreateProgress(ctx, progress)
}

func (r *RepositoryImpl) UpdateProgress(ctx context.Context, progress *models.Progress) error {
	return r.progressRepo.UpdateProgress(ctx, progress)
}

func (r *RepositoryImpl) DeleteProgress(ctx context.Context, id string, userID string) error {
	return r.progressRepo.DeleteProgress(ctx, id, userID)
}

func (r *RepositoryImpl) GetProgressByID(ctx context.Context, id string) (*models.Progress, error) {
	return r.progressRepo.GetProgressByID(ctx, id)
}

func (r *RepositoryImpl) GetProgressByUserID(ctx context.Context, userID string) ([]*models.Progress, error) {
	return r.progressRepo.GetProgressByUserID(ctx, userID)
}

// Методы ActivityRepository
func (r *RepositoryImpl) CreateActivity(ctx context.Context, activity *models.Activity) error {
	return r.activityRepo.CreateActivity(ctx, activity)
}

func (r *RepositoryImpl) GetFeed(ctx context.Context, limit, offset int) ([]*models.Activity, error) {
	return r.activityRepo.GetFeed(ctx, limit, offset)
}

func (r *RepositoryImpl) GetUserActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error) {
	return r.activityRepo.GetUserActivity(ctx, userID, limit, offset)
}

func (r *RepositoryImpl) GetFollowingActivity(ctx context.Context, userID string, limit, offset int) ([]*models.Activity, error) {
	return r.activityRepo.GetFollowingActivity(ctx, userID, limit, offset)
}

// Методы SubscriptionRepository
func (r *RepositoryImpl) Follow(ctx context.Context, followerID, followingID string) error {
	return r.subscriptionRepo.Follow(ctx, followerID, followingID)
}

func (r *RepositoryImpl) Unfollow(ctx context.Context, followerID, followingID string) error {
	return r.subscriptionRepo.Unfollow(ctx, followerID, followingID)
}

func (r *RepositoryImpl) GetFollowers(ctx context.Context, userID string) ([]*models.User, error) {
	return r.subscriptionRepo.GetFollowers(ctx, userID)
}

func (r *RepositoryImpl) GetFollowing(ctx context.Context, userID string) ([]*models.User, error) {
	return r.subscriptionRepo.GetFollowing(ctx, userID)
}

// Методы TokenRepository
func (r *RepositoryImpl) CreateToken(ctx context.Context, token *models.Token) error {
	return r.tokenRepo.CreateToken(ctx, token)
}

func (r *RepositoryImpl) DeleteToken(ctx context.Context, tokenString string) error {
	return r.tokenRepo.DeleteToken(ctx, tokenString)
}

func (r *RepositoryImpl) DeleteUserTokens(ctx context.Context, userID string) error {
	return r.tokenRepo.DeleteUserTokens(ctx, userID)
}

func (r *RepositoryImpl) GetTokenByValue(ctx context.Context, tokenString string) (*models.Token, error) {
	return r.tokenRepo.GetTokenByValue(ctx, tokenString)
}
