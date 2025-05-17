# GameCheck Backend

Серверная часть приложения GameCheck, построенная на Go с использованием Gin и PostgreSQL.

## Технологии

- Go
- Gin Web Framework
- PostgreSQL
- GORM
- JWT

## Установка и запуск

1. **Клонирование репозитория**

```bash
git clone https://github.com/darkfated/gamecheck.git
cd gamecheck/backend
```

2. **Настройка окружения**

Скопируйте файл `.env.example` и создайте `.env`:

```bash
copy .env.example .env
```

Отредактируйте `.env` файл, установив:

- Настройки базы данных
- JWT секретный ключ
- Ключ Steam API (получите на [Steam Dev](https://steamcommunity.com/dev/apikey))

3. **Создание базы данных:** зайдите в PostgreSQL и создайте базу данных `gamecheck`

4. **Запуск приложения**

```bash
go run main.go
```

Сервер запустится по адресу: http://localhost:5000

## API Endpoints

### Аутентификация

| Метод | URL                      | Описание                       |
| ----- | ------------------------ | ------------------------------ |
| GET   | /api/auth/steam          | Инициировать вход через Steam  |
| GET   | /api/auth/steam/callback | Обработать ответ от Steam      |
| GET   | /api/auth/validate-token | Проверить валидность токена    |
| GET   | /api/auth/current        | Получить текущего пользователя |
| POST  | /api/auth/logout         | Выйти из приложения            |

### Пользователи

| Метод | URL                      | Описание                      |
| ----- | ------------------------ | ----------------------------- |
| GET   | /api/users/:id           | Получить профиль пользователя |
| GET   | /api/users/search/:query | Поиск пользователей           |
| PATCH | /api/users/profile       | Обновить профиль              |

### Подписки

| Метод  | URL                              | Описание                    |
| ------ | -------------------------------- | --------------------------- |
| GET    | /api/subscriptions/:id/followers | Получить подписчиков        |
| GET    | /api/subscriptions/:id/following | Получить подписки           |
| POST   | /api/subscriptions/follow/:id    | Подписаться на пользователя |
| DELETE | /api/subscriptions/unfollow/:id  | Отписаться от пользователя  |

### Прогресс в играх

| Метод  | URL                    | Описание                                |
| ------ | ---------------------- | --------------------------------------- |
| GET    | /api/progress          | Получить прогресс текущего пользователя |
| GET    | /api/progress/user/:id | Получить прогресс пользователя по ID    |
| GET    | /api/progress/:id      | Получить запись прогресса по ID         |
| POST   | /api/progress          | Добавить игру                           |
| PATCH  | /api/progress/:id      | Обновить прогресс                       |
| DELETE | /api/progress/:id      | Удалить запись прогресса                |

### Активность

| Метод | URL                     | Описание                         |
| ----- | ----------------------- | -------------------------------- |
| GET   | /api/activity           | Получить общую ленту активности  |
| GET   | /api/activity/user/:id  | Получить активность пользователя |
| GET   | /api/activity/following | Получить активность подписок     |
