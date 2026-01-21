package services

type Services struct {
	Auth     *AuthService
	User     *UserService
	Progress *ProgressService
	Activity *ActivityService
	Steam    *SteamService
}

func New(
	authService *AuthService,
	userService *UserService,
	progressService *ProgressService,
	activityService *ActivityService,
	steamService *SteamService,
) *Services {
	return &Services{
		Auth:     authService,
		User:     userService,
		Progress: progressService,
		Activity: activityService,
		Steam:    steamService,
	}
}
