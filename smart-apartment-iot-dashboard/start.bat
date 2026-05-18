@echo off
REM Smart Apartment IoT Dashboard - Quick Start Script for Windows

echo.
echo 🚀 Smart Apartment IoT Dashboard - Starting...
echo.

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose found
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo.
echo 🐳 Starting Docker services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak

echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo ✅ All services started!
echo.
echo 🌐 Access the application:
echo    Dashboard:  http://localhost:5173
echo    API Docs:   http://localhost:8000/docs
echo    PgAdmin:    http://localhost:5050
echo.
echo 📝 Credentials:
echo    PgAdmin Email:    admin@smartapt.com
echo    PgAdmin Password: admin123
echo    Database User:    smartapt
echo    Database Pass:    smartapt123
echo.
echo 📖 For more information, see SETUP.md
echo.
echo 💡 Useful commands:
echo    View logs:        docker-compose logs -f
echo    Stop services:    docker-compose stop
echo    Restart services: docker-compose restart
echo    Remove services:  docker-compose down
echo.
pause
