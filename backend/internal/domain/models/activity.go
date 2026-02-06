package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ActivityType string

const (
	ActivityTypeAddGame      ActivityType = "add_game"
	ActivityTypeUpdateStatus ActivityType = "update_status"
	ActivityTypeRateGame     ActivityType = "rate_game"
	ActivityTypeFollow       ActivityType = "follow"
)

type Activity struct {
	ID           string       `json:"id" gorm:"type:uuid;primary_key"`
	UserID       string       `json:"userId" gorm:"type:uuid;index:idx_activity_user_created,priority:1"`
	User         User         `json:"user" gorm:"foreignKey:UserID"`
	Type         ActivityType `json:"type"`
	ProgressID   *string      `json:"progressId,omitempty" gorm:"type:uuid;index;default:null"`
	TargetUserID *string      `json:"targetUserId,omitempty" gorm:"type:uuid;default:null"`
	TargetUser   *User        `json:"targetUser,omitempty" gorm:"foreignKey:TargetUserID"`
	Progress     *Progress    `json:"progress,omitempty" gorm:"foreignKey:ProgressID"`
	GameName     *string      `json:"gameName,omitempty" gorm:"default:null"`
	Status       *GameStatus  `json:"status,omitempty" gorm:"default:null"`
	Rating       *int         `json:"rating,omitempty" gorm:"default:null"`
	CreatedAt    time.Time    `json:"createdAt" gorm:"index:idx_activity_user_created,priority:2"`
}

func (a *Activity) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	a.CreatedAt = time.Now()
	return nil
}
