package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User представляет модель пользователя в системе
type User struct {
	ID             string    `json:"id" gorm:"type:uuid;primary_key"`
	SteamID        string    `json:"steamId" gorm:"unique"`
	DisplayName    string    `json:"displayName"`
	AvatarURL      string    `json:"avatarUrl"`
	ProfileURL     string    `json:"profileUrl"`
	DiscordTag     string    `json:"discordTag" gorm:"default:null"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
	LastLoginAt    time.Time `json:"lastLoginAt"`
	ShowWelcome    bool      `json:"showWelcome" gorm:"default:true"`
	FollowersCount int       `json:"followersCount" gorm:"-"`
	FollowingCount int       `json:"followingCount" gorm:"-"`
	IsFollowing    bool      `json:"isFollowing,omitempty" gorm:"-"`
}

// BeforeCreate хук для установки UUID и временных меток
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	now := time.Now()
	u.CreatedAt = now
	u.UpdatedAt = now
	u.LastLoginAt = now
	u.ShowWelcome = true
	return nil
}

func (u *User) BeforeUpdate(tx *gorm.DB) error {
	u.UpdatedAt = time.Now()
	return nil
}

func (u *User) UpdateLastLogin() {
	u.LastLoginAt = time.Now()
}
