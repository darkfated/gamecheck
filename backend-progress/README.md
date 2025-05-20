# GameCheck Progress Service

Микросервис для управления прогрессом пользователей в играх для приложения GameCheck. Построен на Go с использованием Gin и PostgreSQL.

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
cd gamecheck/backend-progress
```

2. **Настройка окружения**

Скопируйте файл `.env.example` и создайте `.env`:

```bash
copy .env.example .env
```

Отредактируйте `.env` файл, установив:

- Настройки базы данных
- JWT секретный ключ

3. **Создание базы данных:** зайдите в PostgreSQL и создайте базу данных `gamecheck` для прогресса

4. **Запуск приложения**

```bash
go run cmd/server/main.go
```

Сервер запустится по адресу: http://localhost:5001

## API Endpoints

### Прогресс в играх

| Метод  | URL                    | Описание                                |
| ------ | ---------------------- | --------------------------------------- |
| GET    | /api/progress          | Получить прогресс текущего пользователя |
| GET    | /api/progress/user/:id | Получить прогресс пользователя по ID    |
| GET    | /api/progress/:id      | Получить запись прогресса по ID         |
| POST   | /api/progress          | Добавить игру                           |
| PATCH  | /api/progress/:id      | Обновить прогресс                       |
| PUT    | /api/progress/:id      | Обновить прогресс                       |
| DELETE | /api/progress/:id      | Удалить запись прогресса                |
| GET    | /api/progress/list     | Получить список прогресса с пагинацией  |

### Служебные

| Метод | URL         | Описание                |
| ----- | ----------- | ----------------------- |
| GET   | /api/health | Проверка статуса сервиса|
