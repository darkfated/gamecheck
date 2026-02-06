package repositories

import (
	"fmt"
	"strings"
	"time"

	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type LibraryRepository struct {
	db *gorm.DB
}

type LibraryGameRow struct {
	models.LibraryGame
	AverageRating float64 `json:"averageRating" gorm:"column:average_rating"`
	RatingsCount  int     `json:"ratingsCount" gorm:"column:ratings_count"`
	ReviewsCount  int     `json:"reviewsCount" gorm:"column:reviews_count"`
	ProgressCount int     `json:"progressCount" gorm:"column:progress_count"`
}

func NewLibraryRepository(db *gorm.DB) *LibraryRepository {
	return &LibraryRepository{db: db}
}

func (r *LibraryRepository) Create(game *models.LibraryGame) error {
	return r.db.Create(game).Error
}

func (r *LibraryRepository) Upsert(game *models.LibraryGame) error {
	return r.db.Clauses(clause.OnConflict{
		Columns: []clause.Column{{Name: "steam_app_id"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"name",
			"short_description",
			"description",
			"header_image",
			"capsule_image",
			"background_image",
			"store_url",
			"primary_genre",
			"genres",
			"categories",
			"tags",
			"updated_at",
		}),
	}).Create(game).Error
}

func (r *LibraryRepository) GetByID(id string) (*models.LibraryGame, error) {
	var game models.LibraryGame
	if err := r.db.First(&game, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &game, nil
}

func (r *LibraryRepository) GetBySteamAppID(appID int) (*models.LibraryGame, error) {
	var game models.LibraryGame
	if err := r.db.First(&game, "steam_app_id = ?", appID).Error; err != nil {
		return nil, err
	}
	return &game, nil
}

func (r *LibraryRepository) Count(search, genre string) (int64, error) {
	var count int64
	query := r.db.Model(&models.LibraryGame{})
	if search != "" {
		query = query.Where("name ILIKE ?", "%"+search+"%")
	}
	if genre != "" {
		query = query.Where("genres::text ILIKE ?", "%"+genre+"%")
	}
	err := query.Count(&count).Error
	return count, err
}

func (r *LibraryRepository) ListWithStats(limit, offset int, search, genre, sortBy, order string) ([]LibraryGameRow, error) {
	sortColumn := "library_games.created_at"
	switch sortBy {
	case "rating":
		sortColumn = "average_rating"
	case "reviews":
		sortColumn = "reviews_count"
	case "progress":
		sortColumn = "progress_count"
	case "name":
		sortColumn = "library_games.name"
	case "createdAt":
		sortColumn = "library_games.created_at"
	default:
		sortColumn = "library_games.created_at"
	}

	order = strings.ToLower(order)
	if order != "asc" {
		order = "desc"
	}

	query := r.db.
		Table("library_games").
		Select(`
			library_games.*,
			COALESCE(AVG(progresses.rating), 0) AS average_rating,
			COALESCE(COUNT(progresses.rating), 0) AS ratings_count,
			COALESCE(SUM(CASE WHEN TRIM(COALESCE(progresses.review, '')) <> '' THEN 1 ELSE 0 END), 0) AS reviews_count,
			COALESCE(COUNT(progresses.id), 0) AS progress_count
		`).
		Joins("LEFT JOIN progresses ON progresses.steam_app_id = library_games.steam_app_id").
		Group("library_games.id").
		Order(fmt.Sprintf("%s %s", sortColumn, order)).
		Limit(limit).
		Offset(offset)

	if search != "" {
		query = query.Where("library_games.name ILIKE ?", "%"+search+"%")
	}
	if genre != "" {
		query = query.Where("library_games.genres::text ILIKE ?", "%"+genre+"%")
	}

	var rows []LibraryGameRow
	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}

	return rows, nil
}

func (r *LibraryRepository) GetWithStatsByID(id string) (*LibraryGameRow, error) {
	var row LibraryGameRow
	tx := r.db.
		Table("library_games").
		Select(`
			library_games.*,
			COALESCE(AVG(progresses.rating), 0) AS average_rating,
			COALESCE(COUNT(progresses.rating), 0) AS ratings_count,
			COALESCE(SUM(CASE WHEN TRIM(COALESCE(progresses.review, '')) <> '' THEN 1 ELSE 0 END), 0) AS reviews_count,
			COALESCE(COUNT(progresses.id), 0) AS progress_count
		`).
		Joins("LEFT JOIN progresses ON progresses.steam_app_id = library_games.steam_app_id").
		Where("library_games.id = ?", id).
		Group("library_games.id").
		Scan(&row)

	if tx.Error != nil {
		return nil, tx.Error
	}
	if tx.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return &row, nil
}

func (r *LibraryRepository) GetWithStatsBySteamAppID(appID int) (*LibraryGameRow, error) {
	var row LibraryGameRow
	tx := r.db.
		Table("library_games").
		Select(`
			library_games.*,
			COALESCE(AVG(progresses.rating), 0) AS average_rating,
			COALESCE(COUNT(progresses.rating), 0) AS ratings_count,
			COALESCE(SUM(CASE WHEN TRIM(COALESCE(progresses.review, '')) <> '' THEN 1 ELSE 0 END), 0) AS reviews_count,
			COALESCE(COUNT(progresses.id), 0) AS progress_count
		`).
		Joins("LEFT JOIN progresses ON progresses.steam_app_id = library_games.steam_app_id").
		Where("library_games.steam_app_id = ?", appID).
		Group("library_games.id").
		Scan(&row)

	if tx.Error != nil {
		return nil, tx.Error
	}
	if tx.RowsAffected == 0 {
		return nil, gorm.ErrRecordNotFound
	}
	return &row, nil
}

type LibraryComment struct {
	ID        string    `json:"id"`
	Review    string    `json:"review"`
	Rating    *int      `json:"rating,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
	User      struct {
		ID          string `json:"id"`
		DisplayName string `json:"displayName"`
		AvatarURL   string `json:"avatarUrl"`
	} `json:"user"`
}

func (r *LibraryRepository) GetCommentsBySteamAppID(appID int, limit, offset int) ([]LibraryComment, error) {
	type commentRow struct {
		ID          string    `gorm:"column:id"`
		Review      string    `gorm:"column:review"`
		Rating      *int      `gorm:"column:rating"`
		CreatedAt   time.Time `gorm:"column:created_at"`
		UserID      string    `gorm:"column:user_id"`
		DisplayName string    `gorm:"column:display_name"`
		AvatarURL   string    `gorm:"column:avatar_url"`
	}

	var rows []commentRow
	err := r.db.
		Table("progresses").
		Select(`
			progresses.id,
			progresses.review,
			progresses.rating,
			progresses.created_at,
			users.id AS user_id,
			users.display_name,
			users.avatar_url
		`).
		Joins("JOIN users ON users.id = progresses.user_id").
		Where("progresses.steam_app_id = ?", appID).
		Where("TRIM(COALESCE(progresses.review, '')) <> ''").
		Order("progresses.created_at DESC").
		Limit(limit).
		Offset(offset).
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	comments := make([]LibraryComment, 0, len(rows))
	for _, row := range rows {
		comment := LibraryComment{
			ID:        row.ID,
			Review:    row.Review,
			Rating:    row.Rating,
			CreatedAt: row.CreatedAt,
		}
		comment.User.ID = row.UserID
		comment.User.DisplayName = row.DisplayName
		comment.User.AvatarURL = row.AvatarURL
		comments = append(comments, comment)
	}

	return comments, nil
}
