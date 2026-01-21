package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"gamecheck/internal/config"
)

type SteamService struct {
	config *config.Config
}

type SteamGameResponse struct {
	AppID    int    `json:"appid"`
	Name     string `json:"name"`
	Icon     string `json:"icon"`
	LogoURL  string `json:"logo_url"`
	StoreURL string `json:"store_url"`
}

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

func NewSteamService(cfg *config.Config) *SteamService {
	return &SteamService{config: cfg}
}

func (s *SteamService) SearchGameByName(gameName string) (*SteamGameResponse, error) {
	gameName = strings.ReplaceAll(strings.TrimSpace(gameName), "’", "'")
	escaped := url.PathEscape(gameName)
	reqURL := "https://steamcommunity.com/actions/SearchApps/" + escaped

	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("User-Agent", "gamecheck-backend/1.0")
	req.Header.Set("Accept", "application/json")

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
		return nil, fmt.Errorf("game not found on steam")
	}

	appIDInt, err := strconv.Atoi(rawResults[0].AppID)
	if err != nil {
		return nil, fmt.Errorf("invalid appid format: %w", err)
	}

	return s.GetGameInfo(appIDInt)
}

func (s *SteamService) SearchGameBySteamID(steamID string, gameName string) (*SteamGameResponse, error) {
	return s.SearchGameByName(gameName)
}

func (s *SteamService) GetGameInfo(appID int) (*SteamGameResponse, error) {
	url := fmt.Sprintf("https://store.steampowered.com/api/appdetails?appids=%d", appID)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch game info: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("store api returned status %d", resp.StatusCode)
	}

	var storeData map[string]struct {
		Success bool `json:"success"`
		Data    struct {
			Name           string `json:"name"`
			SteamAppid     int    `json:"steam_appid"`
			HeaderImage    string `json:"header_image"`
			CapsuleImage   string `json:"capsule_image"`
			CapsuleImageV5 string `json:"capsule_imagev5"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&storeData); err != nil {
		return nil, fmt.Errorf("failed to decode store data: %w", err)
	}

	appIDStr := strconv.Itoa(appID)
	storeInfo, exists := storeData[appIDStr]
	if !exists || !storeInfo.Success {
		return nil, fmt.Errorf("game not found in store api")
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
	url := fmt.Sprintf("https://store.steampowered.com/api/appdetails?appids=%d", appID)
	resp, err := http.Get(url)
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
