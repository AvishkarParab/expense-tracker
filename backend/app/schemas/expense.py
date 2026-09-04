from decimal import Decimal
from pydantic import BaseModel, Field


class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, examples=["Groceries at Supermarket"])
    amount: Decimal = Field(..., gt=Decimal("0.00"), decimal_places=2, examples=[45.50])
    category: str = Field(..., min_length=1, max_length=50, examples=["Groceries"])
    notes: str | None = Field(default=None, max_length=255, examples=["Bought milk and vegetables"])


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseResponse(ExpenseBase):
    id: int