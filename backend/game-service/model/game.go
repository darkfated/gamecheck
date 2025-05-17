package model

import (
	"time"

	"github.com/google/uuid"
)

type Game struct {
	ID          uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description" gorm:"type:text"`
	Genre       string    `json:"genre"`
	Platform    string    `json:"platform"`
	Developer   string    `json:"developer"`
	Publisher   string    `json:"publisher"`
	ReleaseDate string    `json:"releaseDate"`
	AvgRating   float64   `json:"rating" gorm:"column:avg_rating"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
