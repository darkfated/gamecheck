package service

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"
)

type SteamGameInfo struct {
	AppID           int    `json:"AppID"`
	IconURL         string `json:"IconURL"`
	PlaytimeForever int    `json:"PlaytimeForever"`
	StoreURL        string `json:"StoreURL"`
}

// SteamIntegrationService предоставляет методы для интеграции со Steam через основной backend
type SteamIntegrationService struct {
	mainServiceURL string
	client         *http.Client
}

// NewSteamIntegrationService создает новый экземпляр сервиса интеграции со Steam
func NewSteamIntegrationService(mainServiceURL string) *SteamIntegrationService {
	return &SteamIntegrationService{
		mainServiceURL: mainServiceURL,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// GetGameInfoFromSteam получает информацию об игре из Steam через основной backend
func (s *SteamIntegrationService) GetGameInfoFromSteam(steamID, gameName string) (*SteamGameInfo, error) {
	encodedGameName := url.QueryEscape(gameName)

	apiURL := fmt.Sprintf("%s/api/steam/game-info/%s/%s", s.mainServiceURL, steamID, encodedGameName)

	resp, err := s.client.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса к основному сервису: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, nil
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("основной сервис вернул код %d", resp.StatusCode)
	}

	var response struct {
		Success bool           `json:"success"`
		Data    *SteamGameInfo `json:"data"`
		Error   string         `json:"error"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("ошибка декодирования ответа: %w", err)
	}

	if !response.Success {
		return nil, fmt.Errorf("ошибка от основного сервиса: %s", response.Error)
	}

	return response.Data, nil
}
