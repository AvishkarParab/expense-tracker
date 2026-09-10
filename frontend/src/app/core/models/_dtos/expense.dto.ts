export interface ExpenseResponseDto {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  user_id: string;
  created_at?: string;
}

export interface ExpenseCreateDto {
  title: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export type ExpenseUpdateDto = Partial<ExpenseCreateDto>;
