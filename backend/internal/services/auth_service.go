package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"gamecheck/internal/config"
	"gamecheck/internal/domain/models"
	"gamecheck/internal/infra/db/repositories"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type AuthService struct {
	config             *config.Config
	userRepository     *repositories.UserRepository
	tokenRepository    *repositories.TokenRepository
	activityRepository *repositories.ActivityRepository
}

func NewAuthService(
	cfg *config.Config,
	userRepo *repositories.UserRepository,
	tokenRepo *repositories.TokenRepository,
	activityRepo *repositories.ActivityRepository,
) *AuthService {
	return &AuthService{
		config:             cfg,
		userRepository:     userRepo,
		tokenRepository:    tokenRepo,
		activityRepository: activityRepo,
	}
}

func (s *AuthService) HandleSteamCallback(steamID string) (string, *models.User, error) {
	steamAPIURL := fmt.Sprintf(
		"https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=%s&steamids=%s&format=json",
		s.config.Steam.APIKey,
		steamID,
	)

	resp, err := http.Get(steamAPIURL)
	if err != nil {
		return "", nil, fmt.Errorf("failed to fetch steam data: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", nil, fmt.Errorf("failed to read steam response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", nil, fmt.Errorf("steam api returned status %d: %s", resp.StatusCode, string(body))
	}

	var steamResponse struct {
		Response struct {
			Players []struct {
				SteamID      string `json:"steamid"`
				PersonaName  string `json:"personaname"`
				ProfileURL   string `json:"profileurl"`
				AvatarFull   string `json:"avatarfull"`
				AvatarMedium string `json:"avatarmedium"`
			} `json:"players"`
		} `json:"response"`
	}

	if err := json.Unmarshal(body, &steamResponse); err != nil {
		return "", nil, fmt.Errorf("failed to parse steam response: %w", err)
	}

	if len(steamResponse.Response.Players) == 0 {
		return "", nil, fmt.Errorf("no player data returned from steam")
	}

	player := steamResponse.Response.Players[0]
	displayName := player.PersonaName
	avatarURL := player.AvatarFull
	profileURL := player.ProfileURL

	user, err := s.userRepository.GetBySteamID(steamID)
	if err != nil {
		user = &models.User{
			ID:          uuid.New().String(),
			SteamID:     steamID,
			DisplayName: displayName,
			AvatarURL:   avatarURL,
			ProfileURL:  profileURL,
			ShowWelcome: true,
		}
		if err := s.userRepository.Create(user); err != nil {
			return "", nil, fmt.Errorf("failed to create user: %w", err)
		}
	} else {
		user.DisplayName = displayName
		user.AvatarURL = avatarURL
		user.ProfileURL = profileURL
		user.UpdateLastLogin()
		if err := s.userRepository.Update(user); err != nil {
			return "", nil, fmt.Errorf("failed to update user: %w", err)
		}
	}

	token, err := s.GenerateJWT(user.ID)
	if err != nil {
		return "", nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return token, user, nil
}

func (s *AuthService) GenerateJWT(userID string) (string, error) {
	duration, err := time.ParseDuration(s.config.JWT.Expiry)
	if err != nil {
		return "", err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(duration).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(s.config.JWT.Secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (s *AuthService) ValidateJWT(tokenString string) (string, error) {
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.config.JWT.Secret), nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	userID, ok := claims["sub"].(string)
	if !ok {
		return "", fmt.Errorf("invalid user id in token")
	}

	return userID, nil
}

func (s *AuthService) GetUserByID(userID string) (*models.User, error) {
	return s.userRepository.GetByID(userID)
}

func (s *AuthService) Logout(userID string) error {
	return s.tokenRepository.DeleteByUserID(userID)
}
