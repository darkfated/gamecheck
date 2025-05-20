# GameCheck - Микрофронтенд с React и Vue

## Описание проекта

GameCheck - это платформа для геймеров, позволяющая отслеживать прогресс в играх, делиться мнениями и подписываться на других пользователей. Приложение состоит из:

- Backend на Go с использованием фреймворка Gin
- Микросервис для отслеживания прогресса в играх
- Frontend на React.js
- Микрофронтенд на Vue.js (интегрирован в основное приложение)

## Структура проекта

```
/
├── backend/            # Основной бекенд на Go
├── backend-progress/   # Микросервис для прогресса в играх
└── frontend/           # Фронтенд (React + Vue микрофронтенд)
    ├── src/
    │   ├── components/ # React компоненты
    │   ├── contexts/   # Контексты React
    │   ├── pages/      # Страницы React приложения
    │   ├── vue/        # Vue микрофронтенд
    │   │   ├── components/     # Vue компоненты
    │   │   ├── public/         # Публичные файлы Vue
    │   │   └── main.js         # Точка входа Vue приложения
    │   └── ...
    └── ...
```

## Установка и запуск

### Установка зависимостей

#### 1. Бекенд (Go)

```bash
# Основной бекенд
cd backend
go mod download

# Микросервис прогресса
cd ../backend-progress
go mod download
```

#### 2. Фронтенд (React + Vue)

```bash
cd ../frontend
npm install
```

### Запуск приложения

#### 1. Бекенд

```bash
# Настройте .env файл в директориях backend и backend-progress

# В первом терминале запустите основной бекенд
cd backend
go run cmd/server/main.go

# Во втором терминале запустите микросервис прогресса
cd backend-progress
go run cmd/server/main.go
```

#### 2. Фронтенд

```bash
# В третьем терминале запустите React приложение
cd frontend
npm start

# В четвертом терминале запустите Vue микрофронтенд
cd frontend
npm run start:vue
```

После запуска:
- React приложение будет доступно по адресу: http://localhost:3000
- Vue микрофронтенд будет доступен по адресу: http://localhost:8080
- Страница с тестами (интеграция React + Vue) будет доступна по адресу: http://localhost:3000/quizzes

## Особенности реализации

- **Микрофронтенд**: Vue.js интегрирован в React приложение при помощи webpack
- **Изоляция стилей**: Компоненты Vue используют scoped стили
- **Взаимодействие между фреймворками**: Vue компоненты монтируются в React через глобальные функции
- **Аутентификация**: Используется аутентификация через Steam API

## Основные возможности

- 🎮 Отслеживание статуса прохождения игр (играю, пройдено, планирую, брошено)
- ⭐ Оценка пройденных игр
- 👥 Социальные функции (подписки, лента активности)
- 🔐 Авторизация через Steam
- 🌓 Переключение между светлой и тёмной темой оформления

## Архитектура

Проект разделен на несколько компонентов:

- **Frontend** - React, Tailwind CSS
- **Backend Core** - Go, Gin, PostgreSQL (основное API)
- **Backend Progress** - микросервис для трекинга игрового прогресса

## Визуальная составляющая
### Прогресс игрока
![Прогресс игрока](https://github.com/user-attachments/assets/9a1eba09-3a0e-4143-afd9-c1401049f154)
### Главная страница
![Главная страница](https://github.com/user-attachments/assets/a9482b08-3a19-43c5-a2a3-1faca0888797)
### Подписки
![Подписки](https://github.com/user-attachments/assets/a57d41ac-bd1d-499d-ac34-03e098e6b79c)
### Информация игрока
![Информация игрока](https://github.com/user-attachments/assets/2112223a-7d1f-4487-a1a0-e8dcbe1c9019)
### Светлая тема
![Светлая тема](https://github.com/user-attachments/assets/75a8cde4-a8bc-4591-af38-570914f4649f)
### Добавление прогресса и отображение списком
![Добавление прогресса и отображение списком](https://github.com/user-attachments/assets/ad4b1dd8-df42-48f6-b2f1-aef9960b43aa)

## Документация

- [Документация фронтенда](./frontend/README.md)
- [Документация основного бэкенда](./backend/README.md)
- [Документация микросервиса трекинга](./backend-progress/README.md)

## Лицензия

[GNU General Public License v3.0](https://github.com/darkfated/gamecheck/blob/master/LICENSE)
