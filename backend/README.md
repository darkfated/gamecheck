# Backend

## Документация

### Установка зависимостей

```bash
go mod tidy
```

### Запуск сервера

```bash
go run cmd/server/main.go
```

## API методы

### Аутентификация

- `GET /auth/steam` - редирект на авторизацию через Steam
- `GET /auth/steam/callback` - callback от Steam
- `GET /auth/validate-token` - проверка валидности JWT-токена
- `POST /auth/logout` - выход из системы (требует auth)
- `GET /auth/current` - получить текущего пользователя (требует auth)
- `GET /auth/check` - проверка статуса авторизации (опционально)

### Пользователи

- `GET /users/:id` - получить профиль пользователя
- `PATCH /users/profile` - обновить профиль пользователя (требует auth)
- `GET /users/search/:query` - поиск пользователей

### Прогресс игр

- `GET /progress` - получить список игр текущего пользователя (требует auth)
- `GET /progress/user/:userId` - получить список игр пользователя по ID
- `POST /progress` - добавить игру (требует auth)
- `PATCH /progress/:id` - обновить игру (требует auth)
- `DELETE /progress/:id` - удалить игру (требует auth)
- `POST /progress/:id/update-steam` - обновить данные из Steam (требует auth)

### Активности

- `GET /activity` - получить ленту активности (требует auth)
- `GET /activity/user/:userId` - получить активность пользователя
- `GET /activity/following` - получить активность подписок (требует auth)

### Подписки

- `GET /subscriptions/:userId/followers` - получить список подписчиков
- `GET /subscriptions/:userId/following` - получить список подписок
- `POST /subscriptions/follow/:userId` - подписаться на пользователя (требует auth)
- `DELETE /subscriptions/unfollow/:userId` - отписаться от пользователя (требует auth)

### Остальное

- `GET /health` - проверить работоспособность сервера
