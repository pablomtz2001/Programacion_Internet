@echo off
echo ====================================
echo Micro-IA Platform - Inicio Rapido
echo ====================================
echo.

echo Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no esta instalado o no esta en el PATH
    echo Por favor instala Docker Desktop desde https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo.
echo Iniciando servicios con Docker Compose...
echo.

docker-compose up -d

echo.
echo ====================================
echo Servicios iniciados!
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo API Gateway: http://localhost:8000
echo Documentacion API: http://localhost:8000/docs
echo.
echo Para ver los logs: docker-compose logs -f
echo Para detener: docker-compose down
echo.
pause

