import { Component, inject, output, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '@core/services';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.scss',
})
export class AppSidebarComponent {
  readonly collapsed = input(false);
  readonly collapseSidebar = output<void>();
  readonly logout = output<void>();
  protected readonly themeService = inject(ThemeService);
}
