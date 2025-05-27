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
	ID     string     `json:"id" gorm:"type:uuid;primary_key"`
	UserID string     `json:"userId" gorm:"type:uuid;index;not null"`
	Name   string     `json:"name" gorm:"not null"` // Название игры
	Status GameStatus `json:"status" gorm:"not null"`
	Rating *int       `json:"rating,omitempty" gorm:"default:null"` // Оценка от 1 до 10
	Review string     `json:"review,omitempty" gorm:"type:text;default:null"`
	// Стим интеграция
	SteamAppID           *int      `json:"steamAppId,omitempty" gorm:"default:null"`           // Steam App ID если игра найдена в Steam
	SteamIconURL         string    `json:"steamIconUrl,omitempty" gorm:"default:null"`         // URL иконки игры из Steam
	SteamPlaytimeForever *int      `json:"steamPlaytimeForever,omitempty" gorm:"default:null"` // Время игры в Steam в минутах
	SteamStoreURL        string    `json:"steamStoreUrl,omitempty" gorm:"default:null"`        // URL страницы игры в Steam Store
	CreatedAt            time.Time `json:"createdAt"`
	UpdatedAt            time.Time `json:"updatedAt"`
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

// User представляет только базовые данные пользователя, необходимые для микросервиса прогресса
type User struct {
	ID       string `json:"id" gorm:"type:uuid;primary_key"`
	Username string `json:"username" gorm:"not null;unique"`
}
