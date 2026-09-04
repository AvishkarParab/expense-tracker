from fastapi import APIRouter, status
from app.schemas.expense import ExpenseCreate, ExpenseResponse

# Create the router for expense-related endpoints
router = APIRouter(prefix="/expenses", tags=["Expenses"])

# Temporary in-memory list (until we hook up PostgreSQL)
fake_db: list[dict] = []


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseCreate):
    new_id = len(fake_db) + 1
    expense_data = expense.model_dump()
    expense_data["id"] = new_id
    fake_db.append(expense_data)
    return expense_data


@router.get("/", response_model=list[ExpenseResponse])
def list_expenses():
    return fake_db