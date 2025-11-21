from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import httpx

app = FastAPI(
    title="AI Service",
    description="Servicio de Inteligencia Artificial para sugerencias",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


class SuggestionRequest(BaseModel):
    prompt: str
    context: Optional[str] = None
    max_suggestions: Optional[int] = 5


class SuggestionResponse(BaseModel):
    suggestions: List[str]
    reasoning: Optional[str] = None


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "ai-service"}


@app.post("/suggestions", response_model=SuggestionResponse)
async def get_suggestions(request: SuggestionRequest):
    """
    Genera sugerencias inteligentes basadas en el prompt del usuario.
    Si no hay API key de OpenAI, devuelve sugerencias simuladas.
    """
    
    # Si hay API key de OpenAI, usar la API real
    if OPENAI_API_KEY:
        try:
            return await get_openai_suggestions(request)
        except Exception as e:
            # Fallback a sugerencias simuladas si falla la API
            print(f"Error con OpenAI API: {e}")
            return get_simulated_suggestions(request)
    else:
        # Modo simulado para desarrollo
        return get_simulated_suggestions(request)


async def get_openai_suggestions(request: SuggestionRequest) -> SuggestionResponse:
    """Obtiene sugerencias usando OpenAI API"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": "Eres un asistente experto que proporciona sugerencias útiles y prácticas. Responde con una lista de sugerencias numeradas y concisas."
                    },
                    {
                        "role": "user",
                        "content": f"{request.context + ' ' if request.context else ''}{request.prompt}\n\nProporciona {request.max_suggestions} sugerencias específicas y accionables."
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 500
            },
            timeout=30.0
        )
        
        if response.status_code != 200:
            raise Exception(f"OpenAI API error: {response.text}")
        
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        # Extraer sugerencias de la respuesta
        suggestions = []
        for line in content.split("\n"):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-") or line.startswith("•")):
                # Limpiar el formato
                suggestion = line.lstrip("0123456789.-•) ").strip()
                if suggestion:
                    suggestions.append(suggestion)
        
        # Si no se extrajeron bien, dividir por líneas
        if not suggestions:
            suggestions = [s.strip() for s in content.split("\n") if s.strip()][:request.max_suggestions]
        
        return SuggestionResponse(
            suggestions=suggestions[:request.max_suggestions],
            reasoning="Generado con OpenAI GPT-3.5"
        )


def get_simulated_suggestions(request: SuggestionRequest) -> SuggestionResponse:
    """Genera sugerencias simuladas para desarrollo sin API key"""
    
    # Sugerencias genéricas basadas en palabras clave del prompt
    prompt_lower = request.prompt.lower()
    
    suggestions_map = {
        "productividad": [
            "Organiza tus tareas diarias en bloques de tiempo",
            "Usa la técnica Pomodoro (25 min trabajo, 5 min descanso)",
            "Prioriza tareas importantes sobre urgentes",
            "Elimina distracciones durante el trabajo",
            "Revisa y ajusta tu plan semanalmente"
        ],
        "negocio": [
            "Analiza tu mercado objetivo en profundidad",
            "Crea un plan de negocio detallado",
            "Establece métricas claras de éxito",
            "Construye relaciones con clientes potenciales",
            "Invierte en marketing digital estratégico"
        ],
        "tecnología": [
            "Mantén tus sistemas actualizados regularmente",
            "Implementa backups automáticos",
            "Documenta tu código y procesos",
            "Usa control de versiones (Git)",
            "Aprende nuevas tecnologías gradualmente"
        ],
        "salud": [
            "Mantén una rutina de ejercicio regular",
            "Duerme 7-9 horas cada noche",
            "Come comidas balanceadas y variadas",
            "Bebe suficiente agua durante el día",
            "Toma descansos activos durante el trabajo"
        ]
    }
    
    # Buscar sugerencias relevantes
    suggestions = []
    for keyword, keyword_suggestions in suggestions_map.items():
        if keyword in prompt_lower:
            suggestions = keyword_suggestions[:request.max_suggestions]
            break
    
    # Si no hay coincidencias, sugerencias genéricas
    if not suggestions:
        suggestions = [
            "Define objetivos claros y medibles",
            "Crea un plan de acción paso a paso",
            "Establece fechas límite realistas",
            "Revisa y ajusta tu progreso regularmente",
            "Celebra los pequeños logros"
        ][:request.max_suggestions]
    
    return SuggestionResponse(
        suggestions=suggestions,
        reasoning="Sugerencias generadas localmente (modo desarrollo)"
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

