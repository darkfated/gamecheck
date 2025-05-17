-- Скрипт для инициализации баз данных PostgreSQL
-- Версия PostgreSQL: 12+

-- Удаление существующих баз данных (если они существуют)
DROP DATABASE IF EXISTS auth_db;
DROP DATABASE IF EXISTS game_db;
DROP DATABASE IF EXISTS progress_db;
DROP DATABASE IF EXISTS review_db;

-- Создание баз данных для каждого микросервиса
CREATE DATABASE auth_db;
CREATE DATABASE game_db;
CREATE DATABASE progress_db;
CREATE DATABASE review_db;

-- Подключение к базе данных auth_service
\c auth_db;

-- Включение расширения uuid-ossp для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблиц для сервиса аутентификации
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Демонстрационные данные для таблицы пользователей
-- Хешированный пароль 'password123' - этот хеш работает с bcrypt в Go
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$10$4Vc9PDqZ2XAGC2XUwgM5b.Q.3/WKWkUgMsJ44rH8bA5qPZ3YxwMeu', 'admin'),
('user1', 'user1@example.com', '$2a$10$4Vc9PDqZ2XAGC2XUwgM5b.Q.3/WKWkUgMsJ44rH8bA5qPZ3YxwMeu', 'user'),
('user2', 'user2@example.com', '$2a$10$4Vc9PDqZ2XAGC2XUwgM5b.Q.3/WKWkUgMsJ44rH8bA5qPZ3YxwMeu', 'user');

-- Подключение к базе данных game_service
\c game_db;

-- Включение расширения uuid-ossp для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблиц для сервиса игр
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    developer VARCHAR(255),
    publisher VARCHAR(255),
    genre VARCHAR(255),
    platform VARCHAR(255),
    release_date DATE,
    image_url TEXT,
    avg_rating DECIMAL(3, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Демонстрационные данные для таблицы игр
INSERT INTO games (title, description, developer, publisher, genre, platform, release_date, avg_rating) VALUES 
('The Witcher 3: Wild Hunt', 'Epics RPG following Geralt of Rivia', 'CD Projekt Red', 'CD Projekt', 'RPG', 'PC, PS4, Xbox One, Switch', '2015-05-19', 9.5),
('Red Dead Redemption 2', 'Western-themed action-adventure game', 'Rockstar Games', 'Rockstar Games', 'Action-Adventure', 'PC, PS4, Xbox One', '2018-10-26', 9.7),
('Cyberpunk 2077', 'Open-world RPG set in the dystopian Night City', 'CD Projekt Red', 'CD Projekt', 'RPG', 'PC, PS4, PS5, Xbox One, Xbox Series X', '2020-12-10', 7.8),
('Elden Ring', 'Action RPG developed by FromSoftware', 'FromSoftware', 'Bandai Namco', 'Action RPG', 'PC, PS4, PS5, Xbox One, Xbox Series X', '2022-02-25', 9.3),
('God of War Ragnarök', 'Action-adventure game based on Norse mythology', 'Santa Monica Studio', 'Sony Interactive Entertainment', 'Action-Adventure', 'PS4, PS5', '2022-11-09', 9.4);

-- Подключение к базе данных progress_service
\c progress_db;

-- Включение расширения uuid-ossp для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблиц для сервиса прогресса
CREATE TABLE user_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    game_id UUID NOT NULL,
    status VARCHAR(50) CHECK (status IN ('planned', 'playing', 'completed', 'dropped')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, game_id)
);

-- Подключение к базе данных review_service
\c review_db;

-- Включение расширения uuid-ossp для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблиц для сервиса отзывов
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    game_id UUID NOT NULL,
    content TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    status VARCHAR(50) DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, game_id)
); 