from contextlib import asynccontextmanager
from fastapi import FastAPI
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


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    lifespan=lifespan,
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