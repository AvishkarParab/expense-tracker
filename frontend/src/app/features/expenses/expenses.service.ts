import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '@core/_utilities/constants';
import { ApiService } from '@core/services';
import {
  ExpenseCreateDto,
  ExpenseResponseDto,
  ExpenseUpdateDto,
  RequestConfiguration,
  ResultKind,
} from '@core/models';
import { toResultKind$ } from '@core/models/_operators';

export interface ListExpensesParams {
  skip?: number;
  limit?: number;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private readonly apiService = inject(ApiService);

  list$(
    params?: ListExpensesParams,
    configuration?: RequestConfiguration,
  ): Observable<ResultKind<ExpenseResponseDto[]>> {
    return this.apiService
      .get<ExpenseResponseDto[]>(API_ENDPOINTS.EXPENSES.BASE, this.queryParams(params), configuration)
      .pipe(toResultKind$());
  }

  create$(
    payload: ExpenseCreateDto,
    configuration?: RequestConfiguration,
  ): Observable<ResultKind<ExpenseResponseDto>> {
    return this.apiService
      .post<ExpenseResponseDto, ExpenseCreateDto>(API_ENDPOINTS.EXPENSES.BASE, payload, configuration)
      .pipe(toResultKind$());
  }

  update$(
    id: string,
    payload: ExpenseUpdateDto,
    configuration?: RequestConfiguration,
  ): Observable<ResultKind<ExpenseResponseDto>> {
    return this.apiService
      .patch<ExpenseResponseDto, ExpenseUpdateDto>(
        `${API_ENDPOINTS.EXPENSES.BASE}${id}`,
        payload,
        configuration,
      )
      .pipe(toResultKind$());
  }

  delete$(id: string, configuration?: RequestConfiguration): Observable<ResultKind<void>> {
    return this.apiService
      .delete<void>(`${API_ENDPOINTS.EXPENSES.BASE}${id}`, configuration)
      .pipe(toResultKind$());
  }

  private queryParams(
    params?: ListExpensesParams,
  ): Record<string, string | number | boolean> | undefined {
    if (!params) {
      return undefined;
    }

    const entries = Object.entries(params).filter(([, value]) => value !== undefined) as [
      string,
      string | number | boolean,
    ][];

    return entries.length ? Object.fromEntries(entries) : undefined;
  }
}
