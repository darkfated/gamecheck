package main

import (
	"fmt"
	"log"

	"gamecheck/config"
	"gamecheck/internal/app"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Не удалось загрузить конфигурацию: %v", err)
	}

	application, err := app.New(cfg)
	if err != nil {
		log.Fatalf("Не удалось инициализировать приложение: %v", err)
	}

	fmt.Printf("Сервер GameCheck запущен на http://localhost:%s\n", cfg.Port)
	if err := application.Run(); err != nil {
		log.Fatalf("Ошибка при запуске сервера: %v", err)
	}
}
