package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port     string
	Env      string
	JWT      JWTConfig
	Database DatabaseConfig
	Steam    SteamConfig
	CORS     CORSConfig
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

type JWTConfig struct {
	Secret string
	Expiry string
}

type SteamConfig struct {
	APIKey      string
	RedirectURI string
}

type CORSConfig struct {
	Origins []string
}

func Load() (*Config, error) {
	godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	corsOrigins := os.Getenv("CORS_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "http://localhost:3000"
	}

	cfg := &Config{
		Port: port,
		Env:  env,
		JWT: JWTConfig{
			Secret: os.Getenv("JWT_SECRET"),
			Expiry: os.Getenv("JWT_EXPIRY"),
		},
		Database: DatabaseConfig{
			Host:     os.Getenv("DB_HOST"),
			Port:     os.Getenv("DB_PORT"),
			User:     os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASSWORD"),
			Name:     os.Getenv("DB_NAME"),
		},
		Steam: SteamConfig{
			APIKey:      os.Getenv("STEAM_API_KEY"),
			RedirectURI: os.Getenv("STEAM_REDIRECT_URI"),
		},
		CORS: CORSConfig{
			Origins: strings.Split(corsOrigins, ","),
		},
	}

	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

func (c *Config) validate() error {
	if c.JWT.Secret == "" {
		return fmt.Errorf("JWT_SECRET not set")
	}
	if c.JWT.Expiry == "" {
		return fmt.Errorf("JWT_EXPIRY not set")
	}
	if c.Database.Host == "" {
		return fmt.Errorf("DB_HOST not set")
	}
	if c.Steam.APIKey == "" || c.Steam.APIKey == "your-steam-api-key" {
		return fmt.Errorf("STEAM_API_KEY not properly set - please add your Steam API key to .env file")
	}
	return nil
}
