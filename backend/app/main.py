from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.database import Base, engine
import app.models  # Ensures all models are registered on Base.metadata
from app.core.exceptions import register_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables if they don't exist
    yield
    # Shutdown logic (if needed) goes here

# Disable OpenAPI docs in production for security
docs_url = "/docs" if settings.ENVIRONMENT != "production" else None
redoc_url = "/redoc" if settings.ENVIRONMENT != "production" else None

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    lifespan=lifespan,
)

# Apply CORS Middleware
if settings.ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in settings.ALLOWED_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

register_exception_handlers(app)


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "message": f"{settings.PROJECT_NAME} is running smoothly!",
    }


app.include_router(api_router, prefix=settings.API_V1_STR)