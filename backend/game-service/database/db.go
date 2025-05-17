package database

import (
    "github.com/darkfated/gamecheck/backend/game-service/config"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func Connect(cfg *config.Config) *gorm.DB {
    db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
    if err != nil {
        panic("failed to connect to game DB: " + err.Error())
    }
    return db
}
