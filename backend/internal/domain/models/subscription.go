package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Subscription struct {
	ID          string    `json:"id" gorm:"type:uuid;primary_key"`
	FollowerID  string    `json:"followerId" gorm:"type:uuid;index;uniqueIndex:unique_subscription;not null"`
	Follower    User      `json:"follower" gorm:"foreignKey:FollowerID"`
	FollowingID string    `json:"followingId" gorm:"type:uuid;index;uniqueIndex:unique_subscription;not null"`
	Following   User      `json:"following" gorm:"foreignKey:FollowingID"`
	CreatedAt   time.Time `json:"createdAt"`
}

func (s *Subscription) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	s.CreatedAt = time.Now()
	return nil
}
