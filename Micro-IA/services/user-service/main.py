from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid
import os

app = FastAPI(
    title="User Service",
    description="Servicio de gestión de usuarios",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base de datos en memoria (en producción usar PostgreSQL)
users_db = {}


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "user"


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    created_at: str


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "user-service"}


@app.get("/users", response_model=List[UserResponse])
async def get_users():
    """Obtener todos los usuarios"""
    return list(users_db.values())


@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Obtener usuario por ID"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return users_db[user_id]


@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    """Crear nuevo usuario"""
    # Verificar si el email ya existe
    for existing_user in users_db.values():
        if existing_user["email"] == user.email:
            raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": datetime.now().isoformat()
    }
    
    users_db[user_id] = new_user
    return new_user


@app.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str):
    """Eliminar usuario"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    del users_db[user_id]
    return None


@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user: UserCreate):
    """Actualizar usuario"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    users_db[user_id].update({
        "name": user.name,
        "email": user.email,
        "role": user.role
    })
    
    return users_db[user_id]


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8002))
    uvicorn.run(app, host="0.0.0.0", port=port)

