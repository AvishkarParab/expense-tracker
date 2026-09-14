import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { SkeletonComponent } from '@core/ui/skeleton';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass, SkeletonComponent],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly icon = input<string>('bi-graph-up');
  readonly label = input.required<string>();
  readonly value = input<number | null>(null);
  readonly prefix = input<string>('');
  readonly suffix = input<string>('');
  readonly decimals = input<number>(2);
  readonly trend = input<number | null>(null);
  readonly loading = input<boolean>(false);

  protected readonly displayValue = signal(0);

  constructor() {
    effect(() => {
      const target = this.value();
      if (target === null || this.loading()) {
        return;
      }
      this.animateTo(target);
    });
  }

  protected get formattedValue(): string {
    return this.displayValue().toLocaleString(undefined, {
      minimumFractionDigits: this.decimals(),
      maximumFractionDigits: this.decimals(),
    });
  }

  private animateTo(target: number): void {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.displayValue.set(target);
      return;
    }

    const start = this.displayValue();
    const duration = 800;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayValue.set(start + (target - start) * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.displayValue.set(target);
      }
    };

    requestAnimationFrame(step);
  }
}
