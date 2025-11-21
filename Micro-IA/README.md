# Plataforma de Microservicios con IA

Plataforma moderna de microservicios con sugerencias de Inteligencia Artificial e interfaz gráfica.

## 🏗️ Arquitectura

- **API Gateway**: Punto de entrada único para todos los servicios
- **Servicio de IA**: Procesamiento de sugerencias inteligentes
- **Servicio de Usuarios**: Gestión de usuarios y autenticación
- **Frontend**: Interfaz gráfica moderna con React

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo frontend)
- Python 3.10+ (para desarrollo backend)

### Despliegue con Docker

```bash
docker-compose up -d
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- Documentación API: http://localhost:8000/docs

### Desarrollo Local

#### Backend
```bash
cd services/api-gateway
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 📁 Estructura del Proyecto

```
Micro-IA/
├── services/
│   ├── api-gateway/      # API Gateway principal
│   ├── ai-service/       # Servicio de IA
│   └── user-service/     # Servicio de usuarios
├── frontend/             # Interfaz React
└── docker-compose.yml    # Orquestación de servicios
```

## 🔧 Configuración

Crea un archivo `.env` en la raíz con:

```env
OPENAI_API_KEY=tu_api_key_aqui
JWT_SECRET=tu_secret_jwt
DATABASE_URL=postgresql://user:pass@localhost/db
```

## 📝 API Endpoints

- `GET /api/health` - Estado de los servicios
- `POST /api/ai/suggestions` - Obtener sugerencias de IA
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario

## 🛠️ Tecnologías

- **Backend**: FastAPI, Python
- **Frontend**: React, TypeScript, Tailwind CSS
- **IA**: OpenAI API (configurable)
- **Orquestación**: Docker Compose
- **Base de datos**: PostgreSQL (opcional)

