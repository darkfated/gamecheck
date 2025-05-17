@echo off
echo ***** Starting GameCheck Services *****

echo Starting Auth Service...
start cmd /k "cd backend\auth-service && go run main.go"
timeout /t 2 >nul

echo Starting Game Service...
start cmd /k "cd backend\game-service && go run main.go"
timeout /t 2 >nul

echo Starting Progress Service...
start cmd /k "cd backend\progress-service && go run main.go"
timeout /t 2 >nul

echo Starting Review Service...
start cmd /k "cd backend\review-service && go run main.go"

echo ***** All services started *****
echo.
echo Services running on:
echo - Auth:     http://localhost:8081
echo - Game:     http://localhost:8082
echo - Progress: http://localhost:8083
echo - Review:   http://localhost:8084
echo. 