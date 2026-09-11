import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LoaderService } from '@core/services';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLoaderComponent {
  protected readonly loaderService = inject(LoaderService);
}
