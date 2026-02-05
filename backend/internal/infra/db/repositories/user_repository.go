package repositories

import (
	"fmt"
	"strings"

	"gamecheck/internal/domain/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) GetByID(id string) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetBySteamID(steamID string) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, "steam_id = ?", steamID).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id string) error {
	return r.db.Delete(&models.User{}, "id = ?", id).Error
}

func (r *UserRepository) Search(query string, limit int) ([]*models.User, error) {
	var users []*models.User
	err := r.db.Where("display_name ILIKE ?", "%"+query+"%").
		Limit(limit).
		Find(&users).Error
	return users, err
}

func (r *UserRepository) List(limit, offset int, sortBy, order string) ([]*models.User, error) {
	sortColumn := "users.created_at"
	switch sortBy {
	case "totalPlaytime":
		sortColumn = "total_playtime"
	case "averageRating":
		sortColumn = "average_rating"
	case "createdAt":
		sortColumn = "users.created_at"
	default:
		sortColumn = "users.created_at"
	}

	order = strings.ToLower(order)
	if order != "asc" {
		order = "desc"
	}

	type userRow struct {
		models.User
		GamesCount     int     `gorm:"column:games_count"`
		TotalPlaytime  int     `gorm:"column:total_playtime"`
		AverageRating  float64 `gorm:"column:average_rating"`
	}

	var rows []userRow
	err := r.db.
		Table("users").
		Select(`users.*,
			COALESCE(COUNT(progresses.id), 0) AS games_count,
			COALESCE(SUM(progresses.steam_playtime_forever), 0) AS total_playtime,
			COALESCE(AVG(progresses.rating), 0) AS average_rating`).
		Joins("LEFT JOIN progresses ON progresses.user_id = users.id").
		Group("users.id").
		Order(fmt.Sprintf("%s %s", sortColumn, order)).
		Limit(limit).
		Offset(offset).
		Scan(&rows).Error
	if err != nil {
		return nil, err
	}

	users := make([]*models.User, 0, len(rows))
	for _, row := range rows {
		u := row.User
		u.GamesCount = row.GamesCount
		u.TotalPlaytime = row.TotalPlaytime
		u.AverageRating = row.AverageRating
		users = append(users, &u)
	}

	return users, nil
}

func (r *UserRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Count(&count).Error
	return count, err
}

func (r *UserRepository) GetWithStats(userID string) (*models.User, error) {
	user, err := r.GetByID(userID)
	if err != nil {
		return nil, err
	}

	var stats struct {
		GameCount     int64
		TotalPlaytime int64
		AverageRating float64
	}

	r.db.Model(&models.Progress{}).
		Where("user_id = ?", userID).
		Select("COUNT(*) as game_count, COALESCE(SUM(steam_playtime_forever), 0) as total_playtime, COALESCE(AVG(rating), 0) as average_rating").
		Row().Scan(&stats.GameCount, &stats.TotalPlaytime, &stats.AverageRating)

	user.GamesCount = int(stats.GameCount)
	user.TotalPlaytime = int(stats.TotalPlaytime)
	user.AverageRating = stats.AverageRating

	return user, nil
}
