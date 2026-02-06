package repositories

import (
	"time"

	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
)

type ActivityRepository struct {
	db *gorm.DB
}

const maxActivitiesPerUser = 30

type ActivityRow struct {
	ID                string              `gorm:"column:id"`
	Type              models.ActivityType `gorm:"column:type"`
	UserID            string              `gorm:"column:user_id"`
	UserDisplayName   string              `gorm:"column:user_display_name"`
	UserAvatarURL     string              `gorm:"column:user_avatar_url"`
	ProgressID        *string             `gorm:"column:progress_id"`
	GameName          *string             `gorm:"column:game_name"`
	Status            *models.GameStatus  `gorm:"column:status"`
	Rating            *int                `gorm:"column:rating"`
	TargetUserID      *string             `gorm:"column:target_user_id"`
	TargetDisplayName *string             `gorm:"column:target_display_name"`
	TargetAvatarURL   *string             `gorm:"column:target_avatar_url"`
	SteamAppID        *int                `gorm:"column:steam_app_id"`
	SteamIconURL      string              `gorm:"column:steam_icon_url"`
	CreatedAt         time.Time           `gorm:"column:created_at"`
}

func NewActivityRepository(db *gorm.DB) *ActivityRepository {
	return &ActivityRepository{db: db}
}

func (r *ActivityRepository) Create(activity *models.Activity) error {
	if err := r.db.Create(activity).Error; err != nil {
		return err
	}
	if activity.UserID != "" {
		_ = r.TrimUserActivities(activity.UserID, maxActivitiesPerUser)
	}
	return nil
}

func (r *ActivityRepository) GetByID(id string) (*models.Activity, error) {
	var activity models.Activity
	if err := r.db.
		Preload("User").
		Preload("TargetUser").
		Preload("Progress").
		First(&activity, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &activity, nil
}

func (r *ActivityRepository) GetByUserID(userID string, limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity
	err := r.db.
		Preload("User").
		Preload("TargetUser").
		Preload("Progress").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) GetFeed(userID string, limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity
	err := r.db.
		Preload("User").
		Preload("TargetUser").
		Preload("Progress").
		Where("user_id IN (SELECT following_id FROM subscriptions WHERE follower_id = ?) OR user_id = ?", userID, userID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) GetAllActivities(limit, offset int) ([]*models.Activity, error) {
	var activities []*models.Activity
	err := r.db.
		Preload("User").
		Preload("TargetUser").
		Preload("Progress").
		Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&activities).Error
	return activities, err
}

func (r *ActivityRepository) Delete(id string) error {
	return r.db.Delete(&models.Activity{}, "id = ?", id).Error
}

func (r *ActivityRepository) DeleteByProgressID(progressID string) error {
	return r.db.Delete(&models.Activity{}, "progress_id = ?", progressID).Error
}

func (r *ActivityRepository) TrimUserActivities(userID string, max int) error {
	if userID == "" || max <= 0 {
		return nil
	}

	return r.db.Exec(
		`WITH keep AS (
			SELECT id
			FROM activities
			WHERE user_id = ?
			ORDER BY created_at DESC, id DESC
			LIMIT ?
		)
		DELETE FROM activities
		WHERE user_id = ?
		  AND id NOT IN (SELECT id FROM keep)`,
		userID,
		max,
		userID,
	).Error
}

func (r *ActivityRepository) GetFeedRows(userID string, limit, offset int) ([]ActivityRow, error) {
	var rows []ActivityRow
	err := r.activityViewQuery().
		Where("activities.user_id IN (SELECT following_id FROM subscriptions WHERE follower_id = ?) OR activities.user_id = ?", userID, userID).
		Order("activities.created_at DESC").
		Offset(offset).
		Limit(limit).
		Scan(&rows).Error
	return rows, err
}

func (r *ActivityRepository) GetByUserIDRows(userID string, limit, offset int) ([]ActivityRow, error) {
	var rows []ActivityRow
	err := r.activityViewQuery().
		Where("activities.user_id = ?", userID).
		Order("activities.created_at DESC").
		Offset(offset).
		Limit(limit).
		Scan(&rows).Error
	return rows, err
}

func (r *ActivityRepository) GetAllRows(limit, offset int) ([]ActivityRow, error) {
	var rows []ActivityRow
	err := r.activityViewQuery().
		Order("activities.created_at DESC").
		Offset(offset).
		Limit(limit).
		Scan(&rows).Error
	return rows, err
}

func (r *ActivityRepository) activityViewQuery() *gorm.DB {
	return r.db.
		Table("activities").
		Select(`
			activities.id,
			activities.type,
			activities.user_id,
			activities.progress_id,
			activities.game_name,
			activities.status,
			activities.rating,
			activities.target_user_id,
			activities.created_at,
			users.display_name AS user_display_name,
			users.avatar_url AS user_avatar_url,
			target_users.display_name AS target_display_name,
			target_users.avatar_url AS target_avatar_url,
			progresses.steam_app_id AS steam_app_id,
			COALESCE(
				NULLIF(library_games.capsule_image, ''),
				NULLIF(library_games.header_image, ''),
				NULLIF(library_games.background_image, '')
			) AS steam_icon_url
		`).
		Joins("JOIN users ON users.id = activities.user_id").
		Joins("LEFT JOIN users AS target_users ON target_users.id = activities.target_user_id").
		Joins("LEFT JOIN progresses ON progresses.id = activities.progress_id").
		Joins("LEFT JOIN library_games ON library_games.steam_app_id = progresses.steam_app_id")
}
