package service

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/darkfated/gamecheck/backend/auth-service/model"
	"github.com/darkfated/gamecheck/backend/auth-service/repository"
)

type AuthService struct {
	Repo      *repository.UserRepo
	JWTSecret string
}

func NewAuthService(r *repository.UserRepo, secret string) *AuthService {
	return &AuthService{Repo: r, JWTSecret: secret}
}

func (s *AuthService) Signup(u *model.User) error {
	hash, _ := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	u.Password = string(hash)
	return s.Repo.Create(u)
}

func (s *AuthService) Login(email, pass string) (string, *model.User, error) {
	user, err := s.Repo.FindByEmail(email)
	if err != nil {
		return "", nil, err
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(pass)) != nil {
		return "", nil, errors.New("invalid credentials")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID.String(),
		"role": user.Role,
		"exp":  time.Now().Add(72 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString([]byte(s.JWTSecret))
	if err != nil {
		return "", nil, err
	}
	return tokenString, user, nil
}
