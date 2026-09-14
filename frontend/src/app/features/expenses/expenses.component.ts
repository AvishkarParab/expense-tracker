import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { EXPENSE_CATEGORIES } from '@core/_utilities/expense-categories';
import { EXPENSE_MESSAGES, RESULT_KINDS } from '@core/_utilities/constants';
import { LoaderService } from '@core/services';
import { ExpenseResponseDto } from '@core/models';
import { ExpenseListItemComponent, SkeletonComponent } from '@core/ui';
import { ExpensesService } from './expenses.service';
import { ExpenseFormDialogComponent } from './_components/expense-form-dialog';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [ExpenseFormDialogComponent, ExpenseListItemComponent, SkeletonComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent implements OnInit {
  private readonly expensesService = inject(ExpensesService);
  private readonly loaderService = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);

  protected readonly categories = EXPENSE_CATEGORIES;
  protected readonly expenses = signal<ExpenseResponseDto[]>([]);
  protected readonly selectedCategory = signal<string>('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed(() => this.loaderService.isLoading('expenses-list'));

  protected readonly isDialogOpen = signal(false);
  protected readonly editingExpense = signal<ExpenseResponseDto | null>(null);

  ngOnInit(): void {
    void this.loadExpenses();

    if (this.route.snapshot.queryParamMap.get('action') === 'add') {
      this.openAddDialog();
    }
  }

  protected onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
    void this.loadExpenses();
  }

  protected openAddDialog(): void {
    this.editingExpense.set(null);
    this.isDialogOpen.set(true);
  }

  protected openEditDialog(expense: ExpenseResponseDto): void {
    this.editingExpense.set(expense);
    this.isDialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
  }

  protected onExpenseSaved(): void {
    this.isDialogOpen.set(false);
    void this.loadExpenses();
  }

  protected async onDeleteExpense(expense: ExpenseResponseDto): Promise<void> {
    const result = await firstValueFrom(
      this.expensesService.delete$(expense.id, { showLoader: true, sender: 'expenses-list' }),
    );

    if (result.kind === RESULT_KINDS.ERROR) {
      this.errorMessage.set(result.error.details ?? EXPENSE_MESSAGES.DELETE_FAILED);
      return;
    }

    this.expenses.update((items) => items.filter((item) => item.id !== expense.id));
  }

  private async loadExpenses(): Promise<void> {
    this.errorMessage.set(null);

    const category = this.selectedCategory();
    const result = await firstValueFrom(
      this.expensesService.list$(
        { limit: 100, category: category || undefined },
        { showLoader: true, sender: 'expenses-list' },
      ),
    );

    if (result.kind === RESULT_KINDS.ERROR) {
      this.errorMessage.set(result.error.details ?? EXPENSE_MESSAGES.LOAD_FAILED);
      return;
    }

    this.expenses.set(result.data);
  }
}
