package service

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/gamecheck/progress-service/internal/domain/models"
	"github.com/gamecheck/progress-service/internal/domain/repositories"
)

// Errors
var (
	ErrProgressNotFound = errors.New("прогресс не найден")
	ErrInvalidUserID    = errors.New("некорректный ID пользователя")
	ErrInvalidData      = errors.New("некорректные данные")
	ErrUnauthorized     = errors.New("неавторизованный доступ")
)

// ProgressService представляет сервис для работы с прогрессом
type ProgressService struct {
	repo             repositories.ProgressRepository
	steamIntegration *SteamIntegrationService
	userService      *UserService
}

// NewProgressService создает новый сервис прогресса
func NewProgressService(repo repositories.ProgressRepository, steamIntegration *SteamIntegrationService, userService *UserService) *ProgressService {
	return &ProgressService{
		repo:             repo,
		steamIntegration: steamIntegration,
		userService:      userService,
	}
}

// CreateProgress создает новую запись о прогрессе с интеграцией Steam
func (s *ProgressService) CreateProgress(ctx context.Context, progress *models.Progress, authToken string) error {
	if progress.UserID == "" {
		return ErrInvalidUserID
	}

	if progress.Name == "" || progress.Status == "" {
		return ErrInvalidData
	}

	// Пытаемся получить данные из Steam
	if s.steamIntegration != nil && s.userService != nil {
		user, err := s.userService.GetUserByID(progress.UserID, authToken)
		if err != nil {
			log.Printf("[PROGRESS] Не удалось получить данные пользователя: %v", err)
		} else if user.SteamID != "" {
			steamGameInfo, err := s.steamIntegration.GetGameInfoFromSteam(user.SteamID, progress.Name)
			if err != nil {
				log.Printf("[PROGRESS] Ошибка при получении данных Steam: %v", err)
			} else if steamGameInfo != nil {
				progress.SteamAppID = &steamGameInfo.AppID
				progress.SteamIconURL = steamGameInfo.IconURL
				progress.SteamPlaytimeForever = &steamGameInfo.PlaytimeForever
				progress.SteamStoreURL = steamGameInfo.StoreURL

				log.Printf("[PROGRESS] Найдена игра в Steam: %s (AppID: %d, Время игры: %d мин)",
					progress.Name, steamGameInfo.AppID, steamGameInfo.PlaytimeForever)
			} else {
				log.Printf("[PROGRESS] Игра '%s' не найдена в Steam библиотеке пользователя", progress.Name)
			}
		} else {
			log.Printf("[PROGRESS] У пользователя нет привязанного Steam аккаунта")
		}
	}

	// Создание прогресса
	return s.repo.Create(ctx, progress)
}

// GetProgressByID возвращает запись о прогрессе по ID
func (s *ProgressService) GetProgressByID(ctx context.Context, id string) (*models.Progress, error) {
	progress, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if progress == nil {
		return nil, ErrProgressNotFound
	}
	return progress, nil
}

// GetUserProgress возвращает все записи прогресса для пользователя
func (s *ProgressService) GetUserProgress(ctx context.Context, userID string) ([]*models.Progress, error) {
	if userID == "" {
		return nil, ErrInvalidUserID
	}

	return s.repo.GetByUserID(ctx, userID)
}

// UpdateProgress обновляет запись о прогрессе
func (s *ProgressService) UpdateProgress(ctx context.Context, progress *models.Progress) error {
	if progress.ID == "" {
		return ErrInvalidData
	}

	existingProgress, err := s.repo.GetByID(ctx, progress.ID)
	if err != nil {
		return err
	}
	if existingProgress == nil {
		return ErrProgressNotFound
	}

	// Проверяем, что пользователь имеет право обновлять этот прогресс
	if existingProgress.UserID != progress.UserID {
		return ErrUnauthorized
	}

	if progress.Status != "" {
		existingProgress.Status = progress.Status
	}

	// Обрабатываем рейтинг (может быть nil или валидным значением)
	if progress.Rating != nil {
		// Проверяем, что рейтинг находится в допустимом диапазоне 1-10
		if *progress.Rating < 1 || *progress.Rating > 10 {
			return ErrInvalidData
		}
		existingProgress.Rating = progress.Rating
	} else {
		// Если в запросе передан explicit nil, устанавливаем рейтинг в nil
		existingProgress.Rating = nil
	}

	if progress.Review != "" {
		existingProgress.Review = progress.Review
	} else if progress.Review == "" && len(progress.Status) > 0 {
		// Если review явно передан как пустая строка, и есть другие изменения
		// то обновляем поле, а не просто пропускаем его
		existingProgress.Review = ""
	}

	if progress.Name != "" {
		existingProgress.Name = progress.Name
	}

	return s.repo.Update(ctx, existingProgress)
}

// DeleteProgress удаляет запись о прогрессе
func (s *ProgressService) DeleteProgress(ctx context.Context, id string, userID string) error {
	// Проверяем существование прогресса
	progress, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	if progress == nil {
		return ErrProgressNotFound
	}

	// Проверяем, что пользователь имеет право удалять этот прогресс
	if progress.UserID != userID {
		return ErrUnauthorized
	}

	return s.repo.Delete(ctx, id)
}

// ListProgress возвращает список прогресса с пагинацией и фильтрацией
func (s *ProgressService) ListProgress(ctx context.Context, page, pageSize int, filters map[string]interface{}) ([]*models.Progress, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	return s.repo.ListAll(ctx, page, pageSize, filters)
}

// UpdateSteamData обновляет Steam данные для существующей записи прогресса
func (s *ProgressService) UpdateSteamData(ctx context.Context, progressID string, authToken string) error {
	// Получаем существующий прогресс
	progress, err := s.repo.GetByID(ctx, progressID)
	if err != nil {
		return err
	}
	if progress == nil {
		return ErrProgressNotFound
	}

	// Пытаемся получить обновленные данные из Steam
	if s.steamIntegration != nil && s.userService != nil {
		user, err := s.userService.GetUserByID(progress.UserID, authToken)
		if err != nil {
			log.Printf("[PROGRESS] Не удалось получить данные пользователя для обновления Steam данных: %v", err)
			return err
		}

		if user.SteamID != "" {
			// Получаем свежие данные из Steam
			steamGameInfo, err := s.steamIntegration.GetGameInfoFromSteam(user.SteamID, progress.Name)
			if err != nil {
				log.Printf("[PROGRESS] Ошибка при получении обновленных данных Steam: %v", err)
				return err
			}

			if steamGameInfo != nil {
				// Обновляем Steam данные
				oldPlaytime := 0
				if progress.SteamPlaytimeForever != nil {
					oldPlaytime = *progress.SteamPlaytimeForever
				}

				progress.SteamAppID = &steamGameInfo.AppID
				progress.SteamIconURL = steamGameInfo.IconURL
				progress.SteamPlaytimeForever = &steamGameInfo.PlaytimeForever
				progress.SteamStoreURL = steamGameInfo.StoreURL

				log.Printf("[PROGRESS] Обновлены Steam данные для игры: %s (время игры: %d -> %d мин)",
					progress.Name, oldPlaytime, steamGameInfo.PlaytimeForever)

				return s.repo.Update(ctx, progress)
			}
		}
	}

	return fmt.Errorf("не удалось обновить Steam данные")
}
