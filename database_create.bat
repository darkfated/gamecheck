@echo off
chcp 65001 >nul
setlocal ENABLEDELAYEDEXPANSION

echo =================================
echo Создание баз данных PostgreSQL
echo =================================
echo.

set /p PGUSER=Пользователь [Enter = postgres]:
if "%PGUSER%"=="" set PGUSER=postgres

set /p PGPASSWORD=Пароль [Enter = password]:
if "%PGPASSWORD%"=="" set PGPASSWORD=password

set /p PGHOST=Хост [Enter = localhost]:
if "%PGHOST%"=="" set PGHOST=localhost

set /p PGPORT=Порт [Enter = 5432]:
if "%PGPORT%"=="" set PGPORT=5432

set PGDATABASE=postgres

echo.
echo Параметры подключения:
echo Пользователь: %PGUSER%
echo Хост: %PGHOST%
echo Порт: %PGPORT%
echo.

echo Пересоздание баз данных...

echo Завершаем активные подключения к gamecheck...
psql -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='gamecheck';"
psql -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS gamecheck;"
if errorlevel 1 goto error

echo Завершаем активные подключения к gamecheck_progress...
psql -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='gamecheck_progress';"
psql -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS gamecheck_progress;"
if errorlevel 1 goto error

psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE gamecheck;"
if errorlevel 1 goto error

psql -v ON_ERROR_STOP=1 -c "CREATE DATABASE gamecheck_progress;"
if errorlevel 1 goto error

echo.
echo Базы данных успешно созданы:
echo - gamecheck
echo - gamecheck_progress
goto end

:error
echo.
echo Ошибка подключения или недостаточно прав

:end
echo.
pause
