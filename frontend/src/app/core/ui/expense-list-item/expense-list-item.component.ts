import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpenseResponseDto } from '@core/models';

@Component({
  selector: 'app-expense-list-item',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
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

  protected confirmDelete(): void {
    this.confirmingDelete.set(false);
    this.delete.emit(this.expense());
  }
}
