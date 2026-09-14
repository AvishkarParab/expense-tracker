export interface ExpenseResponseDto {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes?: string | null;
  expense_date: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreateDto {
  title: string;
  amount: number;
  category: string;
  notes?: string;
  expense_date: string;
}

export type ExpenseUpdateDto = Partial<ExpenseCreateDto>;

export interface CategoryInsightDto {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface ExpenseInsightsDto {
  total_amount: number;
  total_count: number;
  current_month_amount: number;
  current_month_count: number;
  previous_month_amount: number;
  month_over_month_change: number;
  average_expense: number;
  category_breakdown: CategoryInsightDto[];
}
