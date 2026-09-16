import { maxLength, min, required, SchemaFn } from '@angular/forms/signals';

export interface ExpenseFormModel {
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  notes: string;
}

export function createExpenseFormInitialState(): ExpenseFormModel {
  return {
    title: '',
    amount: 0,
    category: '',
    expenseDate: new Date().toISOString().slice(0, 10),
    notes: '',
  };
}

export const expenseFormSchema: SchemaFn<ExpenseFormModel> = (schema) => {
  required(schema.title, { message: 'Title is required.' });
  maxLength(schema.title, 255);

  required(schema.amount, { message: 'Amount is required.' });
  min(schema.amount, 0.01, { message: 'Enter an amount greater than 0.' });
  required(schema.category, { message: 'Category is required.' });

  required(schema.expenseDate, { message: 'Date is required.' });

  maxLength(schema.notes, 1000);
};
