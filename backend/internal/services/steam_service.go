package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"gamecheck/internal/config"
)

type SteamService struct {
	config      *config.Config
	searchCache map[string]steamSearchCacheEntry
	cacheMu     sync.RWMutex
}

type SteamGameResponse struct {
	AppID    int    `json:"appid"`
	Name     string `json:"name"`
	Icon     string `json:"icon"`
	LogoURL  string `json:"logo_url"`
	StoreURL string `json:"store_url"`
}

type steamSearchResult struct {
	AppID int
	Name  string
	Icon  string
}

type steamSearchCacheEntry struct {
	results   []steamSearchResult
	expiresAt time.Time
}

const (
	steamSearchCacheTTL        = 10 * time.Minute
	steamSearchCacheMaxEntries = 400
)

type SteamPlayerGamesResponse struct {
	Response struct {
		GameCount int `json:"game_count"`
		Games     []struct {
			AppID                    int  `json:"appid"`
			PlaytimeForever          int  `json:"playtime_forever"`
			HasCommunityVisibleStats bool `json:"has_community_visible_stats"`
		} `json:"games"`
	} `json:"response"`
}

type SteamStoreDetails struct {
	AppID            int
	Name             string
	ShortDescription string
	Description      string
	HeaderImage      string
	CapsuleImage     string
	BackgroundImage  string
	StoreURL         string
	Genres           []string
	Categories       []string
}

func NewSteamService(cfg *config.Config) *SteamService {
	return &SteamService{
		config:      cfg,
		searchCache: make(map[string]steamSearchCacheEntry),
	}
}

func (s *SteamService) SearchGameByName(gameName string) (*SteamGameResponse, error) {
	results, err := s.searchApps(gameName)
	if err != nil {
		return nil, err
	}

	choice := results[0]
	storeInfo, err := s.fetchStoreInfo(choice.AppID)
	if err != nil {
		return &SteamGameResponse{
			AppID:    choice.AppID,
			Name:     choice.Name,
			Icon:     choice.Icon,
			StoreURL: fmt.Sprintf("https://store.steampowered.com/app/%d/", choice.AppID),
		}, nil
	}

	name := storeInfo.Data.Name
	if name == "" {
		name = choice.Name
	}

	iconURL := choice.Icon
	if iconURL == "" {
		if storeInfo.Data.CapsuleImageV5 != "" {
			iconURL = storeInfo.Data.CapsuleImageV5
		} else if storeInfo.Data.CapsuleImage != "" {
			iconURL = storeInfo.Data.CapsuleImage
		} else {
			iconURL = storeInfo.Data.HeaderImage
		}
	}

	return &SteamGameResponse{
		AppID:    choice.AppID,
		Name:     name,
		Icon:     iconURL,
		StoreURL: fmt.Sprintf("https://store.steampowered.com/app/%d/", choice.AppID),
	}, nil
}

func (s *SteamService) FindIconForApp(gameName string, appID int) (string, error) {
	results, err := s.searchApps(gameName)
	if err != nil {
		return "", err
	}

	for _, result := range results {
		if result.AppID == appID {
			return result.Icon, nil
		}
	}

	if len(results) > 0 {
		return results[0].Icon, nil
	}

	return "", fmt.Errorf("icon not found")
}

type SteamSearchResult struct {
	AppID int    `json:"steamAppId"`
	Name  string `json:"name"`
	Icon  string `json:"icon"`
}

func (s *SteamService) SearchApps(gameName string, limit int) ([]SteamSearchResult, error) {
	results, err := s.searchApps(gameName)
	if err != nil {
		return nil, err
	}

	if limit > 0 && len(results) > limit {
		results = results[:limit]
	}

	out := make([]SteamSearchResult, 0, len(results))
	for _, result := range results {
		out = append(out, SteamSearchResult{
			AppID: result.AppID,
			Name:  result.Name,
			Icon:  result.Icon,
		})
	}

	return out, nil
}

func (s *SteamService) searchApps(gameName string) ([]steamSearchResult, error) {
	normalized := normalizeSearchQuery(gameName)
	if normalized == "" {
		return nil, fmt.Errorf("game name is empty")
	}

	cacheKey := strings.ToLower(normalized)
	if cached, ok := s.getCachedSearch(cacheKey); ok {
		if len(cached) == 0 {
			return nil, fmt.Errorf("game not found on steam")
		}
		return cached, nil
	}

	escaped := url.PathEscape(normalized)
	reqURL := "https://steamcommunity.com/actions/SearchApps/" + escaped

	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("User-Agent", "gamecheck-backend/1.0")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Accept-Language", "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to search games: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("steam search returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var rawResults []struct {
		AppID string `json:"appid"`
		Name  string `json:"name"`
		Icon  string `json:"icon"`
		Logo  string `json:"logo"`
	}

	if err := json.Unmarshal(body, &rawResults); err != nil {
		return nil, fmt.Errorf("failed to decode search results: %w", err)
	}

	if len(rawResults) == 0 {
		s.setCachedSearch(cacheKey, []steamSearchResult{})
		return nil, fmt.Errorf("game not found on steam")
	}

	results := make([]steamSearchResult, 0, len(rawResults))
	for _, raw := range rawResults {
		appIDInt, err := strconv.Atoi(raw.AppID)
		if err != nil {
			continue
		}
		results = append(results, steamSearchResult{
			AppID: appIDInt,
			Name:  raw.Name,
			Icon:  raw.Icon,
		})
	}

	if len(results) == 0 {
		s.setCachedSearch(cacheKey, []steamSearchResult{})
		return nil, fmt.Errorf("game not found on steam")
	}

	s.setCachedSearch(cacheKey, results)
	return results, nil
}

func normalizeSearchQuery(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return value
	}

	replacer := strings.NewReplacer(
		"\u2019", "'",
		"\u2018", "'",
		"\u0432\u0402\u2122", "'",
		"\u0432\u0402\u02dc", "'",
		"\u00e2\u20ac\u2122", "'",
		"\u00e2\u20ac\u02dc", "'",
	)

	return replacer.Replace(value)
}

func (s *SteamService) getCachedSearch(key string) ([]steamSearchResult, bool) {
	s.cacheMu.RLock()
	entry, exists := s.searchCache[key]
	s.cacheMu.RUnlock()

	if !exists {
		return nil, false
	}

	if time.Now().After(entry.expiresAt) {
		s.cacheMu.Lock()
		delete(s.searchCache, key)
		s.cacheMu.Unlock()
		return nil, false
	}

	return entry.results, true
}

func (s *SteamService) setCachedSearch(key string, results []steamSearchResult) {
	s.cacheMu.Lock()
	defer s.cacheMu.Unlock()

	if len(s.searchCache) >= steamSearchCacheMaxEntries {
		now := time.Now()
		for cacheKey, entry := range s.searchCache {
			if now.After(entry.expiresAt) {
				delete(s.searchCache, cacheKey)
			}
		}
		if len(s.searchCache) >= steamSearchCacheMaxEntries {
			s.searchCache = make(map[string]steamSearchCacheEntry)
		}
	}

	s.searchCache[key] = steamSearchCacheEntry{
		results:   results,
		expiresAt: time.Now().Add(steamSearchCacheTTL),
	}
}

func (s *SteamService) SearchGameBySteamID(steamID string, gameName string) (*SteamGameResponse, error) {
	return s.SearchGameByName(gameName)
}

func (s *SteamService) GetGameInfo(appID int) (*SteamGameResponse, error) {
	storeInfo, err := s.fetchStoreInfo(appID)
	if err != nil {
		return nil, err
	}

	iconURL := ""
	if storeInfo.Data.CapsuleImageV5 != "" {
		iconURL = storeInfo.Data.CapsuleImageV5
	} else if storeInfo.Data.CapsuleImage != "" {
		iconURL = storeInfo.Data.CapsuleImage
	} else {
		iconURL = storeInfo.Data.HeaderImage
	}

	return &SteamGameResponse{
		AppID:    appID,
		Name:     storeInfo.Data.Name,
		Icon:     iconURL,
		StoreURL: fmt.Sprintf("https://store.steampowered.com/app/%d/", appID),
	}, nil
}

func (s *SteamService) GetStoreDetails(appID int) (*SteamStoreDetails, error) {
	storeInfo, err := s.fetchStoreInfo(appID)
	if err != nil {
		return nil, err
	}

	capsule := storeInfo.Data.CapsuleImageV5
	if capsule == "" {
		capsule = storeInfo.Data.CapsuleImage
	}
	if capsule == "" {
		capsule = storeInfo.Data.HeaderImage
	}

	background := storeInfo.Data.BackgroundRaw
	if background == "" {
		background = storeInfo.Data.Background
	}

	genres := make([]string, 0, len(storeInfo.Data.Genres))
	for _, g := range storeInfo.Data.Genres {
		if g.Description != "" {
			genres = append(genres, g.Description)
		}
	}

	categories := make([]string, 0, len(storeInfo.Data.Categories))
	for _, c := range storeInfo.Data.Categories {
		if c.Description != "" {
			categories = append(categories, c.Description)
		}
	}

	return &SteamStoreDetails{
		AppID:            appID,
		Name:             storeInfo.Data.Name,
		ShortDescription: storeInfo.Data.ShortDescription,
		Description:      storeInfo.Data.AboutTheGame,
		HeaderImage:      storeInfo.Data.HeaderImage,
		CapsuleImage:     capsule,
		BackgroundImage:  background,
		StoreURL:         fmt.Sprintf("https://store.steampowered.com/app/%d/", appID),
		Genres:           genres,
		Categories:       categories,
	}, nil
}

type storeInfoResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Name             string `json:"name"`
		SteamAppid       int    `json:"steam_appid"`
		HeaderImage      string `json:"header_image"`
		CapsuleImage     string `json:"capsule_image"`
		CapsuleImageV5   string `json:"capsule_imagev5"`
		Background       string `json:"background"`
		BackgroundRaw    string `json:"background_raw"`
		ShortDescription string `json:"short_description"`
		AboutTheGame     string `json:"about_the_game"`
		Genres           []struct {
			Description string `json:"description"`
		} `json:"genres"`
		Categories []struct {
			Description string `json:"description"`
		} `json:"categories"`
	} `json:"data"`
}

func (s *SteamService) fetchStoreInfo(appID int) (*storeInfoResponse, error) {
	appIDStr := strconv.Itoa(appID)
	urls := []string{
		fmt.Sprintf("https://store.steampowered.com/api/appdetails?appids=%d&cc=ru&l=ru&agecheck=1", appID),
		fmt.Sprintf("https://store.steampowered.com/api/appdetails?appids=%d&cc=ru&l=ru", appID),
		fmt.Sprintf("https://store.steampowered.com/api/appdetails?appids=%d&cc=us&l=en&agecheck=1", appID),
		fmt.Sprintf("https://store.steampowered.com/api/appdetails?appids=%d&cc=us&l=en", appID),
	}

	var lastErr error
	for _, reqURL := range urls {
		req, err := http.NewRequest("GET", reqURL, nil)
		if err != nil {
			lastErr = err
			continue
		}
		req.Header.Set("User-Agent", "gamecheck-backend/1.0")
		req.Header.Set("Accept", "application/json")
		req.Header.Set("Accept-Language", "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7")
		addAgeCheckCookies(req)

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			lastErr = err
			continue
		}
		body, err := io.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			lastErr = err
			continue
		}
		if resp.StatusCode != http.StatusOK {
			lastErr = fmt.Errorf("store api returned status %d", resp.StatusCode)
			continue
		}

		var storeData map[string]storeInfoResponse
		if err := json.Unmarshal(body, &storeData); err != nil {
			lastErr = fmt.Errorf("failed to decode store data: %w", err)
			continue
		}

		storeInfo, exists := storeData[appIDStr]
		if !exists || !storeInfo.Success {
			lastErr = fmt.Errorf("game not found in store api")
			continue
		}

		return &storeInfo, nil
	}

	if lastErr == nil {
		lastErr = fmt.Errorf("game not found in store api")
	}
	return nil, lastErr
}

func addAgeCheckCookies(req *http.Request) {
	req.AddCookie(&http.Cookie{
		Name:  "birthtime",
		Value: "568022401",
		Path:  "/",
	})
	req.AddCookie(&http.Cookie{
		Name:  "lastagecheckage",
		Value: "1-January-1988",
		Path:  "/",
	})
	req.AddCookie(&http.Cookie{
		Name:  "mature_content",
		Value: "1",
		Path:  "/",
	})
	req.AddCookie(&http.Cookie{
		Name:  "wants_mature_content",
		Value: "1",
		Path:  "/",
	})
}

func (s *SteamService) GetUserGames(steamID string) ([]map[string]interface{}, error) {
	url := fmt.Sprintf(
		"https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=%s&steamid=%s&include_appinfo=true",
		s.config.Steam.APIKey,
		steamID,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var data struct {
		Response struct {
			GameCount int `json:"game_count"`
			Games     []struct {
				AppID           int    `json:"appid"`
				Name            string `json:"name"`
				PlaytimeForever int    `json:"playtime_forever"`
				ImgIconURL      string `json:"img_icon_url"`
				ImgLogoURL      string `json:"img_logo_url"`
			} `json:"games"`
		} `json:"response"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	var games []map[string]interface{}
	for _, game := range data.Response.Games {
		games = append(games, map[string]interface{}{
			"appid":            game.AppID,
			"name":             game.Name,
			"playtime_forever": game.PlaytimeForever,
			"img_icon_url":     game.ImgIconURL,
			"img_logo_url":     game.ImgLogoURL,
			"store_url":        fmt.Sprintf("https://store.steampowered.com/app/%d/", game.AppID),
		})
	}

	return games, nil
}

func (s *SteamService) GetGamePlaytime(steamID string, appID int) (int, error) {
	url := fmt.Sprintf(
		"https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=%s&steamid=%s&include_appinfo=true",
		s.config.Steam.APIKey,
		steamID,
	)

	resp, err := http.Get(url)
	if err != nil {
		return 0, fmt.Errorf("failed to fetch owned games: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("steam api returned status %d", resp.StatusCode)
	}

	var data struct {
		Response struct {
			Games []struct {
				AppID           int `json:"appid"`
				PlaytimeForever int `json:"playtime_forever"`
			} `json:"games"`
		} `json:"response"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return 0, fmt.Errorf("failed to decode owned games: %w", err)
	}

	for _, game := range data.Response.Games {
		if game.AppID == appID {
			return game.PlaytimeForever, nil
		}
	}

	return 0, nil
}

func (s *SteamService) GetAppInfoByID(appID int) (map[string]interface{}, error) {
	reqURL := fmt.Sprintf("https://store.steampowered.com/api/appdetails?appids=%d&cc=us&l=ru&agecheck=1", appID)
	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "gamecheck-backend/1.0")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Accept-Language", "ru-RU,ru;q=0.9")
	addAgeCheckCookies(req)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var data map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return data, nil
}

func (s *SteamService) GetPlayerSummaries(steamID string) (*struct {
	SteamID                  string `json:"steamid"`
	PersonaName              string `json:"personaname"`
	ProfileURL               string `json:"profileurl"`
	Avatar                   string `json:"avatar"`
	AvatarMedium             string `json:"avatarmedium"`
	AvatarFull               string `json:"avatarfull"`
	CommunityVisibilityState int    `json:"communityvisibilitystate"`
	ProfileState             int    `json:"profilestate"`
	LastLogOff               int64  `json:"lastlogoff"`
}, error,
) {
	url := fmt.Sprintf(
		"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=%s&steamids=%s",
		s.config.Steam.APIKey,
		steamID,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch player summaries: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("steam api returned status %d", resp.StatusCode)
	}

	var data struct {
		Response struct {
			Players []struct {
				SteamID                  string `json:"steamid"`
				PersonaName              string `json:"personaname"`
				ProfileURL               string `json:"profileurl"`
				Avatar                   string `json:"avatar"`
				AvatarMedium             string `json:"avatarmedium"`
				AvatarFull               string `json:"avatarfull"`
				CommunityVisibilityState int    `json:"communityvisibilitystate"`
				ProfileState             int    `json:"profilestate"`
				LastLogOff               int64  `json:"lastlogoff"`
			} `json:"players"`
		} `json:"response"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("failed to decode player summaries: %w", err)
	}

	if len(data.Response.Players) == 0 {
		return nil, fmt.Errorf("player not found")
	}

	player := data.Response.Players[0]
	return &struct {
		SteamID                  string `json:"steamid"`
		PersonaName              string `json:"personaname"`
		ProfileURL               string `json:"profileurl"`
		Avatar                   string `json:"avatar"`
		AvatarMedium             string `json:"avatarmedium"`
		AvatarFull               string `json:"avatarfull"`
		CommunityVisibilityState int    `json:"communityvisibilitystate"`
		ProfileState             int    `json:"profilestate"`
		LastLogOff               int64  `json:"lastlogoff"`
	}{
		SteamID:                  player.SteamID,
		PersonaName:              player.PersonaName,
		ProfileURL:               player.ProfileURL,
		Avatar:                   player.Avatar,
		AvatarMedium:             player.AvatarMedium,
		AvatarFull:               player.AvatarFull,
		CommunityVisibilityState: player.CommunityVisibilityState,
		ProfileState:             player.ProfileState,
		LastLogOff:               player.LastLogOff,
	}, nil
}

func (s *SteamService) GetPlayerBans(steamID string) (*struct {
	SteamID          string `json:"steamid"`
	CommunityBanned  bool   `json:"CommunityBanned"`
	VACBanned        bool   `json:"VACBanned"`
	NumberOfVACBans  int    `json:"NumberOfVACBans"`
	DaysSinceLastBan int    `json:"DaysSinceLastBan"`
	EconomyBan       string `json:"EconomyBan"`
}, error,
) {
	url := fmt.Sprintf(
		"https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=%s&steamids=%s",
		s.config.Steam.APIKey,
		steamID,
	)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch player bans: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("steam api returned status %d", resp.StatusCode)
	}

	var data struct {
		Players []struct {
			SteamID          string `json:"steamid"`
			CommunityBanned  bool   `json:"CommunityBanned"`
			VACBanned        bool   `json:"VACBanned"`
			NumberOfVACBans  int    `json:"NumberOfVACBans"`
			DaysSinceLastBan int    `json:"DaysSinceLastBan"`
			EconomyBan       string `json:"EconomyBan"`
		} `json:"players"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("failed to decode player bans: %w", err)
	}

	if len(data.Players) == 0 {
		return nil, fmt.Errorf("player bans not found")
	}

	player := data.Players[0]
	return &struct {
		SteamID          string `json:"steamid"`
		CommunityBanned  bool   `json:"CommunityBanned"`
		VACBanned        bool   `json:"VACBanned"`
		NumberOfVACBans  int    `json:"NumberOfVACBans"`
		DaysSinceLastBan int    `json:"DaysSinceLastBan"`
		EconomyBan       string `json:"EconomyBan"`
	}{
		SteamID:          player.SteamID,
		CommunityBanned:  player.CommunityBanned,
		VACBanned:        player.VACBanned,
		NumberOfVACBans:  player.NumberOfVACBans,
		DaysSinceLastBan: player.DaysSinceLastBan,
		EconomyBan:       player.EconomyBan,
	}, nil
}

func (s *SteamService) ExtractSteamID(claimedID string) (string, error) {
	parts := []rune(claimedID)
	for i := len(parts) - 1; i >= 0; i-- {
		if parts[i] == '/' {
			steamID := string(parts[i+1:])
			if _, err := strconv.ParseInt(steamID, 10, 64); err == nil {
				return steamID, nil
			}
		}
	}
	return "", fmt.Errorf("invalid steam id")
}
