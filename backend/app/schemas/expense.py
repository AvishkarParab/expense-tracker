import uuid
from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


# Base shared attributes
class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, example="Groceries")
    amount: Decimal = Field(..., gt=0, decimal_places=2, example=45.50)
    category: str = Field(..., min_length=1, max_length=100, example="Food")
    notes: str | None = Field(None, max_length=1000, example="Weekly supermarket haul")


# Properties to receive on expense creation
class ExpenseCreate(ExpenseBase):
    # Defaults to today when the client omits it; `created_at`/`updated_at`
    # remain pure audit fields and are never editable by the client.
    expense_date: date = Field(default_factory=date.today, example="2026-09-13")


# Properties to receive on expense update (all optional)
class ExpenseUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    amount: Decimal | None = Field(None, gt=0, decimal_places=2)
    category: str | None = Field(None, min_length=1, max_length=100)
    notes: str | None = Field(None, max_length=1000)
    expense_date: date | None = None


# Properties returned to client (includes DB generated fields)
class ExpenseResponse(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    expense_date: date
    created_at: datetime
    updated_at: datetime


class CategoryInsight(BaseModel):
    category: str
    amount: Decimal
    count: int
    percentage: float


class ExpenseInsights(BaseModel):
    total_amount: Decimal
    total_count: int
    current_month_amount: Decimal
    current_month_count: int
    previous_month_amount: Decimal
    month_over_month_change: float
    average_expense: Decimal
    category_breakdown: list[CategoryInsight]