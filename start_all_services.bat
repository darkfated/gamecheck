@echo off

REM Start backend
if exist backend\go.mod (
    echo Starting backend...
    start cmd /k "cd backend && go run ./cmd/server/main.go"
) else (
    echo [Error] go.mod not found in backend folder
)

REM Start backend-progress
if exist backend-progress\go.mod (
    echo Starting backend-progress...
    start cmd /k "cd backend-progress && go run ./cmd/server/main.go"
) else (
    echo [Error] go.mod not found in backend-progress folder
)

REM Start React frontend
if exist frontend\package.json (
    echo Starting React frontend...
    start cmd /k "cd frontend && npm start"
) else (
    echo [Error] package.json not found in frontend folder
)

REM Start Vue frontend
if exist frontend\vue\package.json (
    echo Starting Vue frontend...
    start cmd /k "cd frontend\vue && npm run serve"
) else (
    echo [Error] package.json not found in frontend\vue folder
)

REM Wait for user input
pause
