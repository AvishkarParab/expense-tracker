import uuid
from datetime import datetime
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
    pass


# Properties to receive on expense update (all optional)
class ExpenseUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    amount: Decimal | None = Field(None, gt=0, decimal_places=2)
    category: str | None = Field(None, min_length=1, max_length=100)
    notes: str | None = Field(None, max_length=1000)


# Properties returned to client (includes DB generated fields)
class ExpenseResponse(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime