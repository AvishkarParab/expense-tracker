"""add_expense_date_to_expenses

Revision ID: 7c2f4e6b9a31
Revises: 25425a202c5f
Create Date: 2026-09-13 22:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c2f4e6b9a31'
down_revision: Union[str, Sequence[str], None] = '25425a202c5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'expenses',
        sa.Column('expense_date', sa.Date(), server_default=sa.text('CURRENT_DATE'), nullable=False),
    )
    op.create_index(op.f('ix_expenses_expense_date'), 'expenses', ['expense_date'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_expenses_expense_date'), table_name='expenses')
    op.drop_column('expenses', 'expense_date')
