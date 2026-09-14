export interface ExpenseCategoryOption {
  value: string;
  label: string;
  icon: string;
}

export const EXPENSE_CATEGORIES: readonly ExpenseCategoryOption[] = [
  { value: 'Food', label: 'Food & Dining', icon: 'bi-cup-hot' },
  { value: 'Groceries', label: 'Groceries', icon: 'bi-basket' },
  { value: 'Transport', label: 'Transport', icon: 'bi-car-front' },
  { value: 'Shopping', label: 'Shopping', icon: 'bi-bag' },
  { value: 'Entertainment', label: 'Entertainment', icon: 'bi-film' },
  { value: 'Bills', label: 'Bills & Utilities', icon: 'bi-receipt' },
  { value: 'Health', label: 'Health', icon: 'bi-heart-pulse' },
  { value: 'Education', label: 'Education', icon: 'bi-mortarboard' },
  { value: 'Travel', label: 'Travel', icon: 'bi-airplane' },
  { value: 'Other', label: 'Other', icon: 'bi-three-dots' },
] as const;

const CATEGORY_ICON_LOOKUP = new Map(
  EXPENSE_CATEGORIES.map((category) => [category.value, category.icon]),
);

const DEFAULT_CATEGORY_ICON = 'bi-tag';

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICON_LOOKUP.get(category) ?? DEFAULT_CATEGORY_ICON;
}
