@echo off

REM
if exist backend\go.mod (
    echo Starting backend...
    start cmd /k "cd backend && go run ./cmd/server/main.go"
) else (
    echo [Error] go.mod not found in backend folder
)

REM
if exist backend-progress\go.mod (
    echo Starting backend-progress...
    start cmd /k "cd backend-progress && go run ./cmd/server/main.go"
) else (
    echo [Error] go.mod not found in backend-progress folder
)

REM
if exist frontend\package.json (
    echo Starting React frontend...
    start cmd /k "cd frontend && npm start"
) else (
    echo [Error] package.json not found in frontend folder
)

REM
if exist frontend\package.json (
    echo Starting Vue frontend...
    start cmd /k "cd frontend && npm run start:vue"
) else (
    echo [Error] package.json not found in frontend\vue folder
)

REM
pause
