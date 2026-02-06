package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GameStatus string

type Progress struct {
	ID                   string     `json:"id" gorm:"type:uuid;primary_key"`
	UserID               string     `json:"userId" gorm:"type:uuid;index;not null;index:idx_progress_user_status,priority:1"`
	User                 User       `json:"user" gorm:"foreignKey:UserID"`
	Name                 string     `json:"name" gorm:"not null"`
	Status               GameStatus `json:"status" gorm:"not null;index:idx_progress_user_status,priority:2"`
	Rating               *int       `json:"rating,omitempty" gorm:"default:null"`
	Review               string     `json:"review,omitempty" gorm:"type:text;default:null"`
	SteamAppID           *int       `json:"steamAppId,omitempty" gorm:"default:null;index"`
	SteamPlaytimeForever *int       `json:"steamPlaytimeForever,omitempty" gorm:"default:null"`
	CreatedAt            time.Time  `json:"createdAt"`
	UpdatedAt            time.Time  `json:"updatedAt"`
}

func (p *Progress) BeforeCreate(tx *gorm.DB) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	now := time.Now()
	if p.CreatedAt.IsZero() {
		p.CreatedAt = now
	}
	p.UpdatedAt = now
	return nil
}

func (p *Progress) BeforeUpdate(tx *gorm.DB) error {
	p.UpdatedAt = time.Now()
	return nil
}
