# GameCheck Backend

Набор микросервисов для системы учёта игрового прогресса и отзывов.

## 📦 Структура репозитория

```
gamecheck/
├── database-init.sql     # SQL скрипт для создания баз данных
├── start-services.bat    # Скрипт запуска всех сервисов
└── backend/
    ├── auth-service/     # Авторизация и регистрация
    ├── game-service/     # Управление каталогом игр
    ├── progress-service/ # Учёт прогресса игроков
    ├── review-service/   # Управление отзывами
    └── shared/           # Общие компоненты
```

## ⚙️ Предварительные требования

- Go **1.22+**
- PostgreSQL **12+**
- Windows 10/11

## 🔧 Быстрый старт

1. **Клонируйте репозиторий**  
   ```
   git clone https://github.com/darkfated/gamecheck.git
   cd gamecheck/backend
   ```

2. **Инициализируйте базы данных**  
   ```
   psql -h localhost -p 5432 -U postgres -f database-init.sql postgres
   ```
   
   Этот скрипт автоматически:
   - Создаст базы данных (auth_db, game_db, progress_db, review_db)
   - Создаст необходимые таблицы
   - Добавит тестовые данные

3. **Настройте файлы конфигурации**  
   Скопируйте файлы .env.example в .env для каждого сервиса:
   ```
   copy backend\auth-service\.env.example backend\auth-service\.env
   copy backend\game-service\.env.example backend\game-service\.env
   copy backend\progress-service\.env.example backend\progress-service\.env
   copy backend\review-service\.env.example backend\review-service\.env
   ```

4. **Запустите сервисы**  
   Используйте скрипт для запуска всех сервисов одновременно:
   ```
   start-services.bat
   ```
   
   Или запустите каждый сервис в отдельном терминале:
   ```
   cd backend\auth-service && go run main.go
   cd backend\game-service && go run main.go
   cd backend\progress-service && go run main.go
   cd backend\review-service && go run main.go
   ```

5. **Готово к работе!**
   
   После запуска доступны следующие сервисы:
   - AuthService: http://localhost:8081
   - GameService: http://localhost:8082
   - ProgressService: http://localhost:8083
   - ReviewService: http://localhost:8084

## 📝 Пользователи

Система предустановлена с тестовыми пользователями:

| Логин | Email | Пароль | Роль |
|---|---|---|---|
| admin | admin@example.com | password123 | admin |
| user1 | user1@example.com | password123 | user |
| user2 | user2@example.com | password123 | user |

## 🚀 API эндпоинты

### 1. AuthService (http://localhost:8081)

- **POST** `/v1/auth/signup` — регистрация
- **POST** `/v1/auth/login` — авторизация
- **GET** `/v1/auth/me` — информация о пользователе (JWT)

### 2. GameService (http://localhost:8082)

- **GET** `/v1/games` — список игр
- **GET** `/v1/games/:id` — детали игры

*Только для админа:*
- **POST** `/v1/games` — добавить игру
- **PUT** `/v1/games/:id` — обновить игру
- **DELETE** `/v1/games/:id` — удалить игру

### 3. ProgressService (http://localhost:8083)

*Все запросы требуют JWT*
- **POST** `/v1/users/me/games` — добавить игру в коллекцию
- **GET** `/v1/users/me/games` — получить коллекцию игр
- **DELETE** `/v1/users/me/games/:game_id` — удалить из коллекции

### 4. ReviewService (http://localhost:8084)

- **GET** `/v1/games/:game_id/reviews` — просмотр отзывов

*Требуется JWT:*
- **POST** `/v1/games/:game_id/reviews` — добавить отзыв
- **PUT** `/v1/games/:game_id/reviews/:review_id` — изменить отзыв
- **DELETE** `/v1/games/:game_id/reviews/:review_id` — удалить отзыв

---

## 🛠️ Полезные команды

- **Обновить зависимости**  
  ```bash
  go mod tidy
  ```

- **Сборка бинарника**  
  ```bash
  go build -o bin/auth-service ./auth-service
  ```

- **Запуск тестов**  
  ```bash
  go test ./auth-service/...
  go test ./game-service/...
  # и т.д.
  ```

---

## 📚 Дальнейшие шаги

- Добавить CI/CD (GitHub Actions)  
- Подключить мониторинг (Prometheus, Grafana)  
- Внедрить rate‑limit и CORS через API Gateway  
- Реализовать кэширование частых запросов
- Добавить полнотекстовый поиск по играм
- Реализовать систему уведомлений об обновлениях игр

---

Спасибо! При возникновении вопросов — пишите.
