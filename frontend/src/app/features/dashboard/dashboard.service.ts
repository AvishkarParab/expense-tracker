import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '@core/_utilities/constants';
import { ApiService } from '@core/services';
import { ExpenseInsightsDto, RequestConfiguration, ResultKind } from '@core/models';
import { toResultKind$ } from '@core/models/_operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiService = inject(ApiService);

  getInsights$(configuration?: RequestConfiguration): Observable<ResultKind<ExpenseInsightsDto>> {
    return this.apiService
      .get<ExpenseInsightsDto>(API_ENDPOINTS.EXPENSES.INSIGHTS, undefined, configuration)
      .pipe(toResultKind$());
  }
}
