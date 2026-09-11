import { RESULT_KINDS } from '@core/_utilities/constants';

export interface ResultError {
  status: number;
  message: string;
  details?: string;
}

export type ResultKind<T> =
  | { kind: typeof RESULT_KINDS.SUCCESS; data: T }
  | { kind: typeof RESULT_KINDS.ERROR; error: ResultError };
