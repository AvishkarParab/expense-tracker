from fastapi import APIRouter
from app.api.v1.endpoints import expenses

api_router = APIRouter()

# Register the expenses router
api_router.include_router(expenses.router)