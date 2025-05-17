package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Review struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID    uuid.UUID `json:"user_id" binding:"required,uuid"`
	GameID    uuid.UUID `json:"game_id" binding:"required,uuid"`
	Content   string    `json:"content" binding:"required"`
	Rating    int       `json:"rating" binding:"gte=1,lte=10"`
	Status    string    `json:"status" gorm:"default:'pending'"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
