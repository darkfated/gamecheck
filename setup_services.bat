@echo off

REM
if exist backend\go.mod (
    echo Installing dependencies for backend...
    cd backend && go mod tidy && cd ..
) else (
    echo [Error] go.mod not found in backend folder
)

REM
if exist backend-progress\go.mod (
    echo Installing dependencies for backend-progress...
    cd backend-progress && go mod tidy && cd ..
) else (
    echo [Error] go.mod not found in backend-progress folder
)

REM
if exist frontend\package.json (
    echo Installing dependencies for Frontend...
    cd frontend && npm install && cd ..
) else (
    echo [Error] package.json not found in frontend folder
)

REM
pause
