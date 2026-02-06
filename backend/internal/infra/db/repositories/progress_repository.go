package repositories

import (
	"time"

	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
)

type ProgressRepository struct {
	db *gorm.DB
}

type ProgressStats struct {
	Total       int64
	AvgRating   float64
	RatingCount int64
	ByStatus    map[string]int64
}

type ProgressRow struct {
	ID                   string            `gorm:"column:id"`
	UserID               string            `gorm:"column:user_id"`
	Name                 string            `gorm:"column:name"`
	Status               models.GameStatus `gorm:"column:status"`
	Rating               *int              `gorm:"column:rating"`
	Review               string            `gorm:"column:review"`
	SteamAppID           *int              `gorm:"column:steam_app_id"`
	SteamIconURL         string            `gorm:"column:steam_icon_url"`
	SteamStoreURL        string            `gorm:"column:steam_store_url"`
	SteamPlaytimeForever *int              `gorm:"column:steam_playtime_forever"`
	CreatedAt            time.Time         `gorm:"column:created_at"`
	UpdatedAt            time.Time         `gorm:"column:updated_at"`
}

func NewProgressRepository(db *gorm.DB) *ProgressRepository {
	return &ProgressRepository{db: db}
}

func (r *ProgressRepository) Create(progress *models.Progress) error {
	return r.db.Create(progress).Error
}

func (r *ProgressRepository) GetByID(id string) (*models.Progress, error) {
	var progress models.Progress
	if err := r.db.First(&progress, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &progress, nil
}

func (r *ProgressRepository) GetByUserID(userID string) ([]*models.Progress, error) {
	var progress []*models.Progress
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&progress).Error
	return progress, err
}

func (r *ProgressRepository) Update(progress *models.Progress) error {
	return r.db.Save(progress).Error
}

func (r *ProgressRepository) Delete(id string) error {
	return r.db.Delete(&models.Progress{}, "id = ?", id).Error
}

func (r *ProgressRepository) GetByUserIDAndName(userID, name string) (*models.Progress, error) {
	var progress models.Progress
	err := r.db.Where("user_id = ? AND name = ?", userID, name).First(&progress).Error
	return &progress, err
}

func (r *ProgressRepository) ExistsByUserIDAndSteamAppID(userID string, appID int) (bool, error) {
	var exists bool
	err := r.db.Raw(
		`SELECT EXISTS(
			SELECT 1 FROM progresses WHERE user_id = ? AND steam_app_id = ?
		)`,
		userID,
		appID,
	).Scan(&exists).Error
	return exists, err
}

func (r *ProgressRepository) ExistsByUserIDAndName(userID, name string) (bool, error) {
	var exists bool
	err := r.db.Raw(
		`SELECT EXISTS(
			SELECT 1
			FROM progresses p
			LEFT JOIN library_games lg ON lg.steam_app_id = p.steam_app_id
			WHERE p.user_id = ?
			  AND LOWER(COALESCE(NULLIF(lg.name, ''), p.name)) = LOWER(?)
		)`,
		userID,
		name,
	).Scan(&exists).Error
	return exists, err
}

func (r *ProgressRepository) ListWithLibraryByUserID(userID, status string, limit, offset int) ([]ProgressRow, error) {
	var rows []ProgressRow
	query := r.progressWithLibraryQuery().
		Where("progresses.user_id = ?", userID)
	if status != "" {
		query = query.Where("progresses.status = ?", status)
	}
	if limit > 0 {
		query = query.Limit(limit)
	}
	if offset > 0 {
		query = query.Offset(offset)
	}
	err := query.Order("progresses.created_at DESC").Scan(&rows).Error
	return rows, err
}

func (r *ProgressRepository) GetWithLibraryByID(id string) (*ProgressRow, error) {
	var row ProgressRow
	tx := r.progressWithLibraryQuery().
		Where("progresses.id = ?", id).
		Scan(&row)
	if tx.Error != nil {
		return nil, tx.Error
	}
	if tx.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return &row, nil
}

func (r *ProgressRepository) CountByUserID(userID, status string) (int64, error) {
	var count int64
	query := r.db.Model(&models.Progress{}).Where("user_id = ?", userID)
	if status != "" {
		query = query.Where("status = ?", status)
	}
	err := query.Count(&count).Error
	return count, err
}

func (r *ProgressRepository) GetStatsByUserID(userID string) (*ProgressStats, error) {
	stats := &ProgressStats{
		ByStatus: make(map[string]int64),
	}

	var totals struct {
		Total       int64
		AvgRating   float64
		RatingCount int64
	}
	if err := r.db.Model(&models.Progress{}).
		Where("user_id = ?", userID).
		Select("COUNT(*) as total, COALESCE(AVG(rating), 0) as avg_rating, COUNT(rating) as rating_count").
		Row().
		Scan(&totals.Total, &totals.AvgRating, &totals.RatingCount); err != nil {
		return nil, err
	}

	stats.Total = totals.Total
	stats.AvgRating = totals.AvgRating
	stats.RatingCount = totals.RatingCount

	type statusRow struct {
		Status models.GameStatus `gorm:"column:status"`
		Count  int64             `gorm:"column:count"`
	}
	var rows []statusRow
	if err := r.db.Model(&models.Progress{}).
		Where("user_id = ?", userID).
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&rows).Error; err != nil {
		return nil, err
	}

	for _, row := range rows {
		stats.ByStatus[string(row.Status)] = row.Count
	}

	return stats, nil
}

func (r *ProgressRepository) progressWithLibraryQuery() *gorm.DB {
	return r.db.
		Table("progresses").
		Select(`
			progresses.id,
			progresses.user_id,
			COALESCE(NULLIF(library_games.name, ''), progresses.name) AS name,
			progresses.status,
			progresses.rating,
			progresses.review,
			progresses.steam_app_id,
			progresses.steam_playtime_forever,
			COALESCE(
				NULLIF(library_games.capsule_image, ''),
				NULLIF(library_games.header_image, ''),
				NULLIF(library_games.background_image, '')
			) AS steam_icon_url,
			NULLIF(library_games.store_url, '') AS steam_store_url,
			progresses.created_at,
			progresses.updated_at
		`).
		Joins("LEFT JOIN library_games ON library_games.steam_app_id = progresses.steam_app_id")
}
