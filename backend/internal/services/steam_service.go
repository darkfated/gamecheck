package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"gamecheck/config"
)

type SteamService struct {
	config *config.Config
	client *http.Client
}

// NewSteamService создает новый экземпляр сервиса Steam
func NewSteamService(config *config.Config) *SteamService {
	return &SteamService{
		config: config,
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// SteamGame представляет игру из Steam API
type SteamGame struct {
	AppID                    int    `json:"appid"`
	Name                     string `json:"name"`
	PlaytimeForever          int    `json:"playtime_forever"` // в минутах
	Playtime2Weeks           int    `json:"playtime_2weeks"`  // в минутах
	ImgIconURL               string `json:"img_icon_url"`
	ImgLogoURL               string `json:"img_logo_url"`
	HasCommunityVisibleStats bool   `json:"has_community_visible_stats"`
}

// SteamOwnedGamesResponse представляет ответ Steam API GetOwnedGames
type SteamOwnedGamesResponse struct {
	Response struct {
		GameCount int         `json:"game_count"`
		Games     []SteamGame `json:"games"`
	} `json:"response"`
}

// GetUserOwnedGames получает список игр пользователя из Steam
func (s *SteamService) GetUserOwnedGames(steamID string) ([]SteamGame, error) {
	if s.config.SteamAPI.APIKey == "" || s.config.SteamAPI.APIKey == "your_steam_api_key_here" {
		return nil, fmt.Errorf("Steam API ключ не настроен. Получите ключ на https://steamcommunity.com/dev/apikey")
	}

	apiURL := fmt.Sprintf(
		"https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=%s&steamid=%s&include_appinfo=true&include_played_free_games=true&format=json",
		s.config.SteamAPI.APIKey,
		steamID,
	)

	log.Printf("[STEAM] Запрос к Steam API: %s", strings.Replace(apiURL, s.config.SteamAPI.APIKey, "***", 1))

	resp, err := s.client.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("ошибка запроса к Steam API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 401 {
		return nil, fmt.Errorf("неверный Steam API ключ. Проверьте настройки")
	}

	if resp.StatusCode == 403 {
		return nil, fmt.Errorf("профиль Steam пользователя приватный или недоступен")
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Steam API вернул код %d", resp.StatusCode)
	}

	var steamResponse SteamOwnedGamesResponse
	if err := json.NewDecoder(resp.Body).Decode(&steamResponse); err != nil {
		return nil, fmt.Errorf("ошибка декодирования ответа Steam API: %w", err)
	}

	return steamResponse.Response.Games, nil
}

// FindGameByName ищет игру в Steam библиотеке пользователя по точному названию
func (s *SteamService) FindGameByName(steamID, gameName string) (*SteamGame, error) {
	log.Printf("[STEAM] Поиск игры '%s' для пользователя Steam ID: %s", gameName, steamID)

	games, err := s.GetUserOwnedGames(steamID)
	if err != nil {
		log.Printf("[STEAM ERROR] Ошибка получения библиотеки Steam: %v", err)
		return nil, err
	}

	log.Printf("[STEAM] Получено игр из Steam библиотеки: %d", len(games))

	// Ищем только точное совпадение названий (без учета регистра)
	for _, game := range games {
		if strings.EqualFold(strings.TrimSpace(game.Name), strings.TrimSpace(gameName)) {
			log.Printf("[STEAM] Найдено точное совпадение: '%s' (AppID: %d)", game.Name, game.AppID)
			return &game, nil
		}
	}

	log.Printf("[STEAM] Игра '%s' не найдена в Steam библиотеке. Требуется точное название.", gameName)
	return nil, nil
}

// normalizeGameName нормализует название игры для поиска
func normalizeGameName(name string) string {
	normalized := strings.ToLower(strings.TrimSpace(name))

	normalized = strings.ReplaceAll(normalized, ":", " ")
	normalized = strings.ReplaceAll(normalized, "®", " ")
	normalized = strings.ReplaceAll(normalized, "™", " ")
	normalized = strings.ReplaceAll(normalized, "©", " ")
	normalized = strings.ReplaceAll(normalized, ".", " ")
	normalized = strings.ReplaceAll(normalized, "-", " ")
	normalized = strings.ReplaceAll(normalized, "_", " ")

	normalized = strings.Join(strings.Fields(normalized), " ")

	return normalized
}

// GetSteamIconURL возвращает полный URL иконки игры
func (s *SteamService) GetSteamIconURL(appID int, iconHash string) string {
	if iconHash == "" {
		return ""
	}
	return fmt.Sprintf("https://media.steampowered.com/steamcommunity/public/images/apps/%d/%s.jpg", appID, iconHash)
}

// GetSteamStoreURL возвращает URL страницы игры в Steam Store
func (s *SteamService) GetSteamStoreURL(appID int) string {
	return fmt.Sprintf("https://store.steampowered.com/app/%d/", appID)
}

// SteamGameInfo содержит информацию об игре из Steam для интеграции с Progress
type SteamGameInfo struct {
	AppID           int
	IconURL         string
	PlaytimeForever int
	StoreURL        string
}

// GetGameInfoForProgress получает информацию об игре для интеграции с Progress
func (s *SteamService) GetGameInfoForProgress(steamID, gameName string) (*SteamGameInfo, error) {
	game, err := s.FindGameByName(steamID, gameName)
	if err != nil {
		return nil, err
	}

	if game == nil {
		return nil, nil // игра не найдена
	}

	return &SteamGameInfo{
		AppID:           game.AppID,
		IconURL:         s.GetSteamIconURL(game.AppID, game.ImgIconURL),
		PlaytimeForever: game.PlaytimeForever,
		StoreURL:        s.GetSteamStoreURL(game.AppID),
	}, nil
}
