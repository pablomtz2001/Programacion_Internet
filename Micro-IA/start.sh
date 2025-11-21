#!/bin/bash

echo "===================================="
echo "Micro-IA Platform - Inicio Rapido"
echo "===================================="
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker no está instalado"
    echo "Por favor instala Docker desde https://www.docker.com/get-started"
    exit 1
fi

echo "Iniciando servicios con Docker Compose..."
echo ""

docker-compose up -d

echo ""
echo "===================================="
echo "Servicios iniciados!"
echo "===================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "API Gateway: http://localhost:8000"
echo "Documentación API: http://localhost:8000/docs"
echo ""
echo "Para ver los logs: docker-compose logs -f"
echo "Para detener: docker-compose down"
echo ""

