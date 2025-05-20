package db

import (
	"fmt"
	"log"

	"github.com/gamecheck/progress-service/internal/config"
	"github.com/gamecheck/progress-service/internal/domain/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	db *gorm.DB
}

func NewDatabase(cfg *config.Config) (*Database, error) {
	dsn := cfg.GetDSN()

	logLevel := logger.Info
	if cfg.Env == "production" {
		logLevel = logger.Error
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logLevel),
	})
	if err != nil {
		return nil, fmt.Errorf("не удалось подключиться к базе данных: %w", err)
	}

	log.Println("Подключение к базе данных успешно установлено")

	if err = db.AutoMigrate(&models.Progress{}, &models.User{}); err != nil {
		return nil, fmt.Errorf("не удалось выполнить миграцию базы данных: %w", err)
	}

	return &Database{db: db}, nil
}

func (d *Database) GetDB() *gorm.DB {
	return d.db
}

func (d *Database) Close() error {
	sqlDB, err := d.db.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
