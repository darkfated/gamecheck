package main

import (
	"log"

	"github.com/gamecheck/progress-service/internal/app"
	"github.com/gamecheck/progress-service/internal/config"
)

func main() {
	// Загружаем конфигурацию
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Ошибка загрузки конфигурации: %v", err)
	}

	// Создаем приложение
	application, err := app.New(cfg)
	if err != nil {
		log.Fatalf("Ошибка инициализации приложения: %v", err)
	}

	// Запускаем приложение
	log.Printf("Микросервис прогресса запускается на порту %s", cfg.Port)
	if err := application.Run(); err != nil {
		log.Fatalf("Ошибка при работе приложения: %v", err)
	}
}

