package config

import "os"

type Config struct {
	DatabaseURL    string
	Port           string
	GameServiceURL string
	JWTSecret      string
}

func Load() *Config {
	gameServiceURL := os.Getenv("GAME_SERVICE_URL")
	if gameServiceURL == "" {
		gameServiceURL = "http://localhost:8082" // URL по умолчанию
	}

	return &Config{
		DatabaseURL:    os.Getenv("DATABASE_URL"),
		Port:           os.Getenv("PORT"),
		GameServiceURL: gameServiceURL,
		JWTSecret:      os.Getenv("JWT_SECRET"),
	}
}
