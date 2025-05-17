package config

import "os"

type Config struct {
    DatabaseURL    string
    Port           string
    GameServiceURL string
}

func Load() *Config {
    return &Config{
        DatabaseURL:    os.Getenv("DATABASE_URL"),
        Port:           os.Getenv("PORT"),
        GameServiceURL: os.Getenv("GAME_SERVICE_URL"),
    }
}
