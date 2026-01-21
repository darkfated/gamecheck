# Backend

## Документация

1. **Установка зависимостей**

```bash
go mod tidy
```

2. **Запуск**

```bash
go run cmd/server/main.go
```

## API методы

### Auth

- `GET /api/auth/steam` - Steam login redirect
- `GET /api/auth/steam/callback` - Steam callback
- `GET /api/auth/validate-token` - Validate JWT token
- `POST /api/auth/logout` - Logout (требует auth)
- `GET /api/auth/current` - Get current user (требует auth)
- `GET /api/auth/check` - Check auth status (опционально)

### Пользователи

- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/profile` - Update profile (требует auth)
- `GET /api/users/search/:query` - Search users

### Прогресс игр

- `GET /api/progress` - Get current user games (требует auth)
- `GET /api/progress/user/:userId` - Get user games by ID
- `POST /api/progress` - Add game (требует auth)
- `PATCH /api/progress/:id` - Update game (требует auth)
- `DELETE /api/progress/:id` - Delete game (требует auth)
- `POST /api/progress/:id/update-steam` - Update Steam data (требует auth)

### Активности

- `GET /api/activity` - Get activity feed (требует auth)
- `GET /api/activity/user/:userId` - Get user activity
- `GET /api/activity/following` - Get following activity (требует auth)

### Подписки

- `GET /api/subscriptions/:userId/followers` - Get followers
- `GET /api/subscriptions/:userId/following` - Get following
- `POST /api/subscriptions/follow/:userId` - Follow user (требует auth)
- `DELETE /api/subscriptions/unfollow/:userId` - Unfollow user (требует auth)
