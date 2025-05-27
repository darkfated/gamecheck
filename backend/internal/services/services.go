package services

// Services объединяет все сервисы приложения
type Services struct {
	Auth     *AuthService
	User     *UserService
	Activity *ActivityService
	Steam    *SteamService
}

func NewServices(
	authService *AuthService,
	userService *UserService,
	activityService *ActivityService,
	steamService *SteamService,
) *Services {
	return &Services{
		Auth:     authService,
		User:     userService,
		Activity: activityService,
		Steam:    steamService,
	}
}
