package services

// Services объединяет все сервисы приложения
type Services struct {
	Auth     *AuthService
	User     *UserService
	Activity *ActivityService
}

func NewServices(
	authService *AuthService,
	userService *UserService,
	activityService *ActivityService,
) *Services {
	return &Services{
		Auth:     authService,
		User:     userService,
		Activity: activityService,
	}
}
