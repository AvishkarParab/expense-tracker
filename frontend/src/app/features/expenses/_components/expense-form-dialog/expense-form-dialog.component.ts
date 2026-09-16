import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormField, FormRoot, form } from '@angular/forms/signals';
import { EXPENSE_CATEGORIES } from '@core/_utilities/expense-categories';
import { EXPENSE_MESSAGES, RESULT_KINDS } from '@core/_utilities/constants';
import { LoaderService } from '@core/services';
import { ExpenseResponseDto, ExpenseCreateDto } from '@core/models';
import {
  FormErrorsComponent,
  InputNumberComponent,
  InputTextComponent,
  InputDateComponent,
} from '@core/ui';
import { ExpensesService } from '../../expenses.service';
import { createExpenseFormInitialState, expenseFormSchema, ExpenseFormModel } from '../../_models';

@Component({
  selector: 'app-expense-form-dialog',
  standalone: true,
  imports: [
    FormErrorsComponent,
    FormField,
    FormRoot,
    InputTextComponent,
    InputNumberComponent,
    InputDateComponent,
  ],
  templateUrl: './expense-form-dialog.component.html',
  styleUrl: './expense-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseFormDialogComponent {
  private readonly expensesService = inject(ExpensesService);
  private readonly loaderService = inject(LoaderService);

  readonly open = input(false);
  readonly expense = input<ExpenseResponseDto | null>(null);

  readonly closed = output<void>();
  readonly saved = output<ExpenseResponseDto>();

  protected readonly categories = EXPENSE_CATEGORIES;

  protected readonly expenseModel = signal<ExpenseFormModel>(createExpenseFormInitialState());
  protected readonly expenseForm = form(this.expenseModel, expenseFormSchema, {
    submission: {
      action: () => this.submitExpense(),
    },
  });

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isSubmitting = computed(() => this.loaderService.isLoading('expense-submit'));
  protected readonly isEditMode = computed(() => this.expense() !== null);

  constructor() {
    effect(() => {
      if (!this.open()) {
        return;
      }

      const editing = this.expense();
      this.errorMessage.set(null);
      this.expenseModel.set(
        editing
          ? {
              title: editing.title,
              amount: editing.amount,
              category: editing.category,
              expenseDate: editing.expense_date,
              notes: editing.notes ?? '',
            }
          : createExpenseFormInitialState(),
      );
    });
  }

  protected dismiss(): void {
    this.closed.emit();
  }

  private async submitExpense(): Promise<void> {
    this.errorMessage.set(null);

    const model = this.expenseModel();
    const payload: ExpenseCreateDto = {
      title: model.title.trim(),
      amount: Number(model.amount),
      category: model.category,
      expense_date: model.expenseDate,
      notes: model.notes.trim() || undefined,
    };

    const editing = this.expense();
    const result = await firstValueFrom(
      editing
        ? this.expensesService.update$(editing.id, payload, {
            showLoader: true,
            sender: 'expense-submit',
          })
        : this.expensesService.create$(payload, {
            showLoader: true,
            sender: 'expense-submit',
          }),
    );

    if (result.kind === RESULT_KINDS.ERROR) {
      this.errorMessage.set(
        result.error.details ??
          (editing ? EXPENSE_MESSAGES.UPDATE_FAILED : EXPENSE_MESSAGES.CREATE_FAILED),
      );
      return;
    }

    this.saved.emit(result.data);
  }
}
