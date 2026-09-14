import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ExpenseResponseDto } from '@core/models';
import { getCategoryIcon } from '@core/_utilities/expense-categories';

@Component({
  selector: 'app-expense-list-item',
  standalone: true,
  imports: [NgClass, CurrencyPipe, DatePipe],
  templateUrl: './expense-list-item.component.html',
  styleUrl: './expense-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseListItemComponent {
  readonly expense = input.required<ExpenseResponseDto>();
  readonly viewOnly = input(false);

  readonly edit = output<ExpenseResponseDto>();
  readonly delete = output<ExpenseResponseDto>();

  protected readonly confirmingDelete = signal(false);

  protected get categoryIcon(): string {
    return getCategoryIcon(this.expense().category);
  }

  protected confirmDelete(): void {
    this.confirmingDelete.set(false);
    this.delete.emit(this.expense());
  }
}
