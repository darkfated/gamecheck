package db

import (
	"fmt"
	"log"
	"time"

	"gamecheck/internal/config"
	"gamecheck/internal/domain/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	db *gorm.DB
}

func New(cfg *config.Config) (*Database, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Name,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(25)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	err = sqlDB.Ping()
	if err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Successfully connected to database")

	database := &Database{db: db}
	if err := database.Migrate(); err != nil {
		return nil, err
	}

	return database, nil
}

func (d *Database) Migrate() error {
	if err := d.db.AutoMigrate(
		&models.User{},
		&models.Progress{},
		&models.Activity{},
		&models.LibraryGame{},
		&models.Token{},
		&models.Subscription{},
	); err != nil {
		return err
	}

	return d.ensureActivityTrimTrigger()
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

func (d *Database) ensureActivityTrimTrigger() error {
	createFn := `
CREATE OR REPLACE FUNCTION trim_user_activities() RETURNS trigger AS $$
BEGIN
	DELETE FROM activities
	WHERE user_id = NEW.user_id
	  AND id NOT IN (
		SELECT id
		FROM activities
		WHERE user_id = NEW.user_id
		ORDER BY created_at DESC, id DESC
		LIMIT 30
	  );
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`

	if err := d.db.Exec(createFn).Error; err != nil {
		return err
	}

	if err := d.db.Exec(`DROP TRIGGER IF EXISTS activities_trim_trigger ON activities;`).Error; err != nil {
		return err
	}

	createTrigger := `
CREATE TRIGGER activities_trim_trigger
AFTER INSERT ON activities
FOR EACH ROW
EXECUTE PROCEDURE trim_user_activities();
`

	return d.db.Exec(createTrigger).Error
}
