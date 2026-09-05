from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, get_valid_user_expense
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate

router = APIRouter()


@router.post(
    "/",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an expense",
)
def create_expense(
    payload: ExpenseCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    expense = Expense(**payload.model_dump(), user_id=current_user.id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.post(
    "/bulk",
    response_model=list[ExpenseResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create multiple expenses in bulk",
)
def create_expenses_bulk(
    payload: list[ExpenseCreate],
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    expense_models = [
        Expense(**item.model_dump(), user_id=current_user.id)
        for item in payload
    ]
    db.add_all(expense_models)
    db.commit()

    for expense in expense_models:
        db.refresh(expense)

    return expense_models


@router.get(
    "/",
    response_model=list[ExpenseResponse],
    summary="List expenses",
)
def list_expenses(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: str | None = Query(None),
):
    query = select(Expense).where(Expense.user_id == current_user.id)

    if category:
        query = query.where(Expense.category == category)

    query = query.offset(skip).limit(limit).order_by(Expense.created_at.desc())
    return db.execute(query).scalars().all()


@router.get(
    "/{expense_id}",
    response_model=ExpenseResponse,
    summary="Get single expense",
)
def get_expense(
    expense: Annotated[Expense, Depends(get_valid_user_expense)],
):
    return expense


@router.patch(
    "/{expense_id}",
    response_model=ExpenseResponse,
    summary="Update expense",
)
def update_expense(
    payload: ExpenseUpdate,
    expense: Annotated[Expense, Depends(get_valid_user_expense)],
    db: Annotated[Session, Depends(get_db)],
):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)

    db.commit()
    db.refresh(expense)
    return expense


@router.delete(
    "/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete expense",
)
def delete_expense(
    expense: Annotated[Expense, Depends(get_valid_user_expense)],
    db: Annotated[Session, Depends(get_db)],
):
    db.delete(expense)
    db.commit()