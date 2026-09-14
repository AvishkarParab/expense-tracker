import { maxLength, pattern, required, SchemaFn } from '@angular/forms/signals';

export interface ExpenseFormModel {
  title: string;
  amount: string;
  category: string;
  expenseDate: string;
  notes: string;
}

export function createExpenseFormInitialState(): ExpenseFormModel {
  return {
    title: '',
    amount: '',
    category: '',
    expenseDate: new Date().toISOString().slice(0, 10),
    notes: '',
  };
}

// Rejects empty/zero amounts (e.g. "0", "0.00") while allowing up to 2 decimal places.
const AMOUNT_PATTERN = /^(?!0*\.?0*$)\d+(\.\d{1,2})?$/;

export const expenseFormSchema: SchemaFn<ExpenseFormModel> = (schema) => {
  required(schema.title, { message: 'Title is required.' });
  maxLength(schema.title, 255);

  required(schema.amount, { message: 'Amount is required.' });
  pattern(schema.amount, AMOUNT_PATTERN, { message: 'Enter an amount greater than 0.' });

  required(schema.category, { message: 'Category is required.' });

  required(schema.expenseDate, { message: 'Date is required.' });

  maxLength(schema.notes, 1000);
};
