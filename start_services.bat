@echo off

REM
if exist backend\go.mod (
    echo Запуск Backend...
    start cmd /k "cd backend && go run ./cmd/server/main.go"
) else (
    echo [Error] go.mod не найден в папке backend
)

REM
if exist backend-progress\go.mod (
    echo Запуск Backend Progress...
    start cmd /k "cd backend-progress && go run ./cmd/server/main.go"
) else (
    echo [Error] go.mod не найден в папке backend-progress
)

REM
if exist frontend\package.json (
    echo Запуск React Frontend...
    start cmd /k "cd frontend && npm start"
) else (
    echo [Error] package.json не найден в папке frontend
)

REM
pause
