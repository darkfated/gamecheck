package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port     string
	Env      string
	DB       DBConfig
	JWT      JWTConfig
	SteamAPI SteamAPIConfig
}

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	Secret    string
	ExpiresIn time.Duration
}

type SteamAPIConfig struct {
	APIKey      string
	RedirectURI string
}

func (c *DBConfig) DSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.Name, c.SSLMode)
}

func Load() (*Config, error) {
	_ = godotenv.Load()

	port := getEnv("PORT", "5000")
	env := getEnv("ENV", "development")

	dbConfig := DBConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "postgres"),
		Name:     getEnv("DB_NAME", "gamecheck"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}

	jwtExpStr := getEnv("JWT_EXPIRATION", "24h")
	jwtExpDuration, err := time.ParseDuration(jwtExpStr)
	if err != nil {
		jwtExpDuration = 24 * time.Hour
	}

	jwtConfig := JWTConfig{
		Secret:    getEnv("JWT_SECRET", "your_jwt_secret_key"),
		ExpiresIn: jwtExpDuration,
	}

	steamAPIConfig := SteamAPIConfig{
		APIKey:      getEnv("STEAM_API_KEY", ""),
		RedirectURI: getEnv("STEAM_REDIRECT_URI", "http://localhost:5000/api/auth/steam/callback"),
	}

	config := &Config{
		Port:     port,
		Env:      env,
		DB:       dbConfig,
		JWT:      jwtConfig,
		SteamAPI: steamAPIConfig,
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return defaultValue
}
