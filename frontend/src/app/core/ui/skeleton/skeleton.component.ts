import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: '',
  styleUrl: './skeleton.component.scss',
  host: {
    class: 'app-skeleton',
    '[class.app-skeleton-circle]': "shape() === 'circle'",
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.borderRadius]': "shape() === 'circle' ? '50%' : radius()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly radius = input<string>('0.5rem');
  readonly shape = input<'block' | 'circle'>('block');
}
