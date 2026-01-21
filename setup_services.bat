@echo off
chcp 65001 >nul
setlocal ENABLEDELAYEDEXPANSION

REM
if exist backend\go.mod (
    echo Установка зависимостей для Backend...
    cd backend && go mod tidy && cd ..
) else (
    echo [Error] go.mod не найден в папке backend
)

REM
if exist frontend\package.json (
    echo Установка зависимостей для React Frontend...
    cd frontend && npm install && cd ..
) else (
    echo [Error] package.json не найден в папке frontend
)

REM
pause
