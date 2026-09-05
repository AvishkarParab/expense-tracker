import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserProfileUpdate(BaseModel):
    full_name: str | None = Field(None, min_length=1, max_length=255, examples=["Alex Morgan"])
    age: int | None = Field(None, ge=1, le=130, examples=[28])
    currency: str | None = Field(None, min_length=3, max_length=3, examples=["INR"])


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    is_active: bool
    full_name: str | None
    age: int | None
    currency: str
    created_at: datetime
    updated_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"