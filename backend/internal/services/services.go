package services

type Services struct {
	Auth     *AuthService
	User     *UserService
	Progress *ProgressService
	Activity *ActivityService
	Library  *LibraryService
	Steam    *SteamService
}

func New(
	authService *AuthService,
	userService *UserService,
	progressService *ProgressService,
	activityService *ActivityService,
	libraryService *LibraryService,
	steamService *SteamService,
) *Services {
	return &Services{
		Auth:     authService,
		User:     userService,
		Progress: progressService,
		Activity: activityService,
		Library:  libraryService,
		Steam:    steamService,
	}
}
