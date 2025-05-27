package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type User struct {
	ID          string `json:"id"`
	SteamID     string `json:"steamId"`
	DisplayName string `json:"displayName"`
	AvatarURL   string `json:"avatarUrl"`
	ProfileURL  string `json:"profileUrl"`
}

// UserService предоставляет методы для работы с данными пользователей через основной backend
type UserService struct {
	mainServiceURL string
	client         *http.Client
}

// NewUserService создает новый экземпляр сервиса пользователей
func NewUserService(mainServiceURL string) *UserService {
	return &UserService{
		mainServiceURL: mainServiceURL,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// GetUserByID получает данные пользователя по ID из основного backend
func (s *UserService) GetUserByID(userID, authToken string) (*User, error) {
	apiURL := fmt.Sprintf("%s/api/users/%s", s.mainServiceURL, userID)

	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("ошибка создания запроса: %w", err)
	}

	if authToken != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", authToken))
	}
	req.Header.Set("Accept", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса к основному сервису: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("пользователь не найден")
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("основной сервис вернул код %d", resp.StatusCode)
	}

	var user User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, fmt.Errorf("ошибка декодирования ответа: %w", err)
	}

	return &user, nil
}
