package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	URLS     Urls
	Port     string
	Env      string
	JWT      JWTConfig
	Database DatabaseConfig
	Steam    SteamConfig
	CORS     CORSConfig
}

type Urls struct {
	Frontend string
	Backend  string
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

	frontendURL := os.Getenv("FRONTEND_URL")
	backendURL := os.Getenv("BACKEND_URL")

	cfg := &Config{
		URLS: Urls{
			Frontend: frontendURL,
			Backend:  backendURL,
		},
		Port: os.Getenv("BACKEND_PORT"),
		Env:  os.Getenv("GO_ENV"),
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
			RedirectURI: backendURL + os.Getenv("STEAM_REDIRECT_URI"),
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
