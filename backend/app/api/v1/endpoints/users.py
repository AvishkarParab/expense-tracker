from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserProfileUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/profile",
    response_model=UserResponse,
    summary="Get current user profile",
)
def get_my_profile(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user


@router.patch(
    "/profile",
    response_model=UserResponse,
    summary="Update current user profile",
)
def update_my_profile(
    payload: UserProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user