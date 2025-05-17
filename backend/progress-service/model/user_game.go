package model

import (
    "time"

    "github.com/google/uuid"
    "gorm.io/gorm"
)

type UserGame struct {
    ID        uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
    UserID    uuid.UUID      `json:"user_id" binding:"required,uuid"`
    GameID    uuid.UUID      `json:"game_id" binding:"required,uuid"`
    Status    string         `json:"status" binding:"oneof=planned playing completed dropped"`
    Rating    int            `json:"rating" binding:"gte=1,lte=10"`
    UpdatedAt time.Time
    CreatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
