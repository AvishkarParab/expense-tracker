from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.expense import Expense
from app.schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate

router = APIRouter()


@router.post(
    "/",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an expense",
)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    expense = Expense(**payload.model_dump())
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
    db: Session = Depends(get_db),
):
    # Map incoming schemas to SQLAlchemy model instances
    expense_models = [Expense(**item.model_dump()) for item in payload]
    
    # Bulk insert in a single transaction
    db.add_all(expense_models)
    db.commit()
    
    # Refresh instances to populate DB-generated fields (id, timestamps)
    for expense in expense_models:
        db.refresh(expense)
        
    return expense_models

@router.get(
    "/",
    response_model=list[ExpenseResponse],
    summary="List expenses",
)
def list_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: str | None = Query(None),
    db: Session = Depends(get_db),
):
    query = select(Expense)
    if category:
        query = query.where(Expense.category == category)
    query = query.offset(skip).limit(limit).order_by(Expense.id)
    
    return db.execute(query).scalars().all()


@router.get(
    "/{expense_id}",
    response_model=ExpenseResponse,
    summary="Get single expense",
)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.get(Expense, expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found",
        )
    return expense


@router.patch(
    "/{expense_id}",
    response_model=ExpenseResponse,
    summary="Update expense",
)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    db: Session = Depends(get_db),
):
    expense = db.get(Expense, expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found",
        )

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
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.get(Expense, expense_id)
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found",
        )
    db.delete(expense)
    db.commit()