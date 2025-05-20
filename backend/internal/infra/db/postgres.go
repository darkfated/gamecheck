package db

import (
	"fmt"
	"log"

	"gamecheck/config"
	"gamecheck/internal/domain/models"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Database представляет экземпляр базы данных
type Database struct {
	DB *gorm.DB
}

// NewDatabase создает новый экземпляр базы данных
func NewDatabase(cfg *config.Config) (*Database, error) {
	dsn := cfg.DB.DSN()

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	}

	if cfg.Env == "development" {
		gormConfig.Logger = logger.Default.LogMode(logger.Info)
	}

	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к базе данных: %w", err)
	}

	database := &Database{
		DB: db,
	}

	if err := database.migrateSchema(); err != nil {
		return nil, fmt.Errorf("ошибка миграции схемы базы данных: %w", err)
	}

	return database, nil
}

// migrateSchema создает необходимые таблицы и связи в базе данных
func (d *Database) migrateSchema() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return fmt.Errorf("ошибка получения SQL DB: %w", err)
	}

	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("не удалось подключиться к базе данных: %w", err)
	}

	log.Println("Успешное подключение к PostgreSQL")

	d.DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")

	// Миграция схемы базы данных
	if err := d.DB.AutoMigrate(
		&models.User{},
		&models.Activity{},
		&models.Subscription{},
		&models.Token{},
	); err != nil {
		return fmt.Errorf("ошибка автомиграции: %w", err)
	}

	return nil
}

func (d *Database) GetDB() *gorm.DB {
	return d.DB
}

func (d *Database) Close() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}

func NewUUID() string {
	return uuid.New().String()
}
