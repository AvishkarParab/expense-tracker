from fastapi import FastAPI
from app.api.v1.router import api_router

app = FastAPI(
    title="Expense Tracker API",
    version="0.1.0",
)

# Global health check endpoint
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "message": "Expense Tracker API is up and running!"}


# Mount all v1 API routes under /api/v1
app.include_router(api_router, prefix="/api/v1")