package model

import (
    "time"

    "github.com/google/uuid"
    "gorm.io/gorm"
)

type User struct {
    ID        uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
    Username  string         `gorm:"unique;not null"`
    Email     string         `gorm:"unique;not null"`
    Password  string         `gorm:"not null"`
    Role      string         `gorm:"default:'user'"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
