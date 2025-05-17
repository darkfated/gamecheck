package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GameStatus string

const (
	// Статусы игр
	StatusPlaying    GameStatus = "playing"
	StatusCompleted  GameStatus = "completed"
	StatusPlanToPlay GameStatus = "plan_to_play"
	StatusDropped    GameStatus = "dropped"
)

// Progress представляет прогресс пользователя в игре
type Progress struct {
	ID        string     `json:"id" gorm:"type:uuid;primary_key"`
	UserID    string     `json:"userId" gorm:"type:uuid;index;not null"`
	User      User       `json:"user" gorm:"foreignKey:UserID"`
	Name      string     `json:"name" gorm:"not null"` // Название игры
	Status    GameStatus `json:"status" gorm:"not null"`
	Rating    *int       `json:"rating,omitempty" gorm:"default:null"` // Оценка от 1 до 10
	Review    string     `json:"review,omitempty" gorm:"type:text;default:null"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

// BeforeCreate хук для установки UUID и временных меток
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
