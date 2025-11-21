from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import os
from typing import Optional

app = FastAPI(
    title="Micro-IA API Gateway",
    description="API Gateway para la plataforma de microservicios con IA",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URLs de los servicios
AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:8001")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://localhost:8002")

# Cliente HTTP
http_client = httpx.AsyncClient(timeout=30.0)


@app.get("/")
async def root():
    return {
        "message": "Micro-IA API Gateway",
        "status": "running",
        "services": {
            "ai-service": AI_SERVICE_URL,
            "user-service": USER_SERVICE_URL
        }
    }


@app.get("/api/health")
async def health_check():
    """Verifica el estado de todos los servicios"""
    services_status = {}
    
    # Verificar AI Service
    try:
        response = await http_client.get(f"{AI_SERVICE_URL}/health")
        services_status["ai-service"] = "healthy" if response.status_code == 200 else "unhealthy"
    except:
        services_status["ai-service"] = "unreachable"
    
    # Verificar User Service
    try:
        response = await http_client.get(f"{USER_SERVICE_URL}/health")
        services_status["user-service"] = "healthy" if response.status_code == 200 else "unhealthy"
    except:
        services_status["user-service"] = "unreachable"
    
    return {
        "status": "ok",
        "gateway": "healthy",
        "services": services_status
    }


@app.post("/api/ai/suggestions")
async def get_ai_suggestions(request: Request):
    """Obtener sugerencias de IA"""
    try:
        body = await request.json()
        response = await http_client.post(
            f"{AI_SERVICE_URL}/suggestions",
            json=body
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"AI Service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/users")
async def get_users():
    """Obtener lista de usuarios"""
    try:
        response = await http_client.get(f"{USER_SERVICE_URL}/users")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"User Service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/users")
async def create_user(request: Request):
    """Crear nuevo usuario"""
    try:
        body = await request.json()
        response = await http_client.post(
            f"{USER_SERVICE_URL}/users",
            json=body
        )
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"User Service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """Obtener usuario por ID"""
    try:
        response = await http_client.get(f"{USER_SERVICE_URL}/users/{user_id}")
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail=f"User Service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

