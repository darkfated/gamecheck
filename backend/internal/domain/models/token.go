package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Token представляет JWT токен сессии
type Token struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key"`
	UserID    string    `json:"userId" gorm:"type:uuid;index"`
	User      User      `json:"-" gorm:"foreignKey:UserID"`
	Token     string    `json:"token" gorm:"unique"`
	ExpiresAt time.Time `json:"expiresAt"`
	CreatedAt time.Time `json:"createdAt"`
}

func (t *Token) BeforeCreate(tx *gorm.DB) error {
	if t.ID == "" {
		t.ID = uuid.New().String()
	}
	t.CreatedAt = time.Now()
	return nil
}
