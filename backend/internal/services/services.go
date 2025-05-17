package services

// Services объединяет все сервисы приложения
type Services struct {
	Auth     *AuthService
	User     *UserService
	Progress *ProgressService
	Activity *ActivityService
}

// NewServices создает новый экземпляр композитного сервиса
func NewServices(
	authService *AuthService,
	userService *UserService,
	progressService *ProgressService,
	activityService *ActivityService,
) *Services {
	return &Services{
		Auth:     authService,
		User:     userService,
		Progress: progressService,
		Activity: activityService,
	}
}
