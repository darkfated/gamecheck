package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LibraryGame struct {
	ID               string    `json:"id" gorm:"type:uuid;primary_key"`
	SteamAppID       int       `json:"steamAppId" gorm:"uniqueIndex;not null"`
	Name             string    `json:"name"`
	ShortDescription string    `json:"shortDescription" gorm:"type:text"`
	Description      string    `json:"description" gorm:"type:text"`
	HeaderImage      string    `json:"headerImage"`
	CapsuleImage     string    `json:"capsuleImage"`
	BackgroundImage  string    `json:"backgroundImage"`
	StoreURL         string    `json:"storeUrl"`
	PrimaryGenre     string    `json:"primaryGenre"`
	Genres           []string  `json:"genres" gorm:"type:jsonb;serializer:json"`
	Categories       []string  `json:"categories" gorm:"type:jsonb;serializer:json"`
	Tags             []string  `json:"tags" gorm:"type:jsonb;serializer:json"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

func (l *LibraryGame) BeforeCreate(tx *gorm.DB) error {
	if l.ID == "" {
		l.ID = uuid.New().String()
	}
	now := time.Now()
	if l.CreatedAt.IsZero() {
		l.CreatedAt = now
	}
	l.UpdatedAt = now
	return nil
}

func (l *LibraryGame) BeforeUpdate(tx *gorm.DB) error {
	l.UpdatedAt = time.Now()
	return nil
}
