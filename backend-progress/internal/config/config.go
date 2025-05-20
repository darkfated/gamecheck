package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config содержит конфигурацию микросервиса
type Config struct {
	Env  string
	Port string

	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	JWTSecret         string
	JWTExpiration     int
	RefreshSecret     string
	RefreshExpiration int

	UserServiceURL string
}

// Load загружает конфигурацию из переменных окружения
func Load() (*Config, error) {
	_ = godotenv.Load()

	config := &Config{
		Env:  getEnv("ENV", "development"),
		Port: getEnv("PORT", "8081"),

		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "password"),
		DBName:     getEnv("DB_NAME", "gamecheck_progress"),
		DBSSLMode:  getEnv("DB_SSL_MODE", "disable"),

		JWTSecret:         getEnv("JWT_SECRET", "your-secret-key"),
		JWTExpiration:     getEnvAsInt("JWT_EXPIRATION", 15),
		RefreshSecret:     getEnv("REFRESH_SECRET", "your-refresh-secret"),
		RefreshExpiration: getEnvAsInt("REFRESH_EXPIRATION", 10080),

		UserServiceURL: getEnv("USER_SERVICE_URL", "http://localhost:8080"),
	}

	return config, nil
}

// GetDSN возвращает строку подключения к базе данных
func (c *Config) GetDSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
}

// Helper функции для получения переменных окружения
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}
