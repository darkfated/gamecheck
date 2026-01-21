package utils

import (
	"fmt"
	"regexp"
	"strings"
)

func ValidateUsername(username string) error {
	if len(username) < 4 {
		return fmt.Errorf("username must be at least 4 characters")
	}
	if len(username) > 20 {
		return fmt.Errorf("username must not exceed 20 characters")
	}

	if username != strings.ToLower(username) {
		return fmt.Errorf("username must be lowercase")
	}

	if !regexp.MustCompile(`^[a-z0-9_]+$`).MatchString(username) {
		return fmt.Errorf("username can only contain lowercase letters, numbers, and underscores")
	}

	return nil
}

func ValidateGameName(name string) error {
	trimmed := strings.TrimSpace(name)
	if len(trimmed) < 2 {
		return fmt.Errorf("game name must be at least 2 characters")
	}
	if len(trimmed) > 40 {
		return fmt.Errorf("game name must not exceed 40 characters")
	}
	return nil
}

func ValidateReview(review string) error {
	if len(review) > 200 {
		return fmt.Errorf("review must not exceed 200 characters")
	}
	return nil
}

func ValidateRating(rating int) error {
	if rating < 1 || rating > 10 {
		return fmt.Errorf("rating must be between 1 and 10")
	}
	return nil
}
