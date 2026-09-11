import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AppHeaderComponent } from '@core/layout/app-header.component';
import { AppSidebarComponent } from '@core/layout/app-sidebar.component';
import { ThemeService } from '@core/services/theme.service';
import { TokenStorageService } from '@core/services/token-storage.service';

@Component({
  selector: 'app-root',
  imports: [AppHeaderComponent, AppSidebarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly themeService = inject(ThemeService);
  protected readonly tokenStorage = inject(TokenStorageService);
  protected readonly isSidebarCollapsed = signal(false);
  private readonly router = inject(Router);

  protected toggleSidebar(): void {
    this.isSidebarCollapsed.update((collapsed) => !collapsed);
  }

  protected logout(): void {
    this.tokenStorage.clearToken();
    this.router.navigate(['/login']);
  }
}
