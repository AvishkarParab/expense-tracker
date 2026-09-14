import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

import { EXPENSE_MESSAGES, RESULT_KINDS } from '@core/_utilities/constants';
import { getCategoryIcon } from '@core/_utilities/expense-categories';
import { LoaderService } from '@core/services';
import { CategoryInsightDto, ExpenseInsightsDto, ExpenseResponseDto } from '@core/models';
import { ExpenseListItemComponent, SkeletonComponent, StatCardComponent } from '@core/ui';
import { ExpensesService } from '@features/expenses/expenses.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
    ExpenseListItemComponent,
    NgClass,
    RouterLink,
    SkeletonComponent,
    StatCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly expensesService = inject(ExpensesService);
  private readonly loaderService = inject(LoaderService);

  protected readonly insights = signal<ExpenseInsightsDto | null>(null);
  protected readonly recentExpenses = signal<ExpenseResponseDto[]>([]);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed(() => this.loaderService.isLoading('dashboard-insights'));
  protected readonly getCategoryIcon = getCategoryIcon;

  protected readonly topCategories = computed<CategoryInsightDto[]>(() =>
    (this.insights()?.category_breakdown ?? []).slice(0, 5),
  );

  ngOnInit(): void {
    void this.loadDashboard();
  }

  private async loadDashboard(): Promise<void> {
    this.errorMessage.set(null);

    const [insightsResult, expensesResult] = await Promise.all([
      firstValueFrom(
        this.dashboardService.getInsights$({ showLoader: true, sender: 'dashboard-insights' }),
      ),
      firstValueFrom(this.expensesService.list$({ limit: 5 })),
    ]);

    if (insightsResult.kind === RESULT_KINDS.ERROR) {
      this.errorMessage.set(insightsResult.error.details ?? EXPENSE_MESSAGES.INSIGHTS_FAILED);
      return;
    }

    this.insights.set(insightsResult.data);

    if (expensesResult.kind === RESULT_KINDS.SUCCESS) {
      this.recentExpenses.set(expensesResult.data);
    }
  }
}
