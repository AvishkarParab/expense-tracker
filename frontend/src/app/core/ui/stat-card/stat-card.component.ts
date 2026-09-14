import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
  untracked,
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
  readonly label = input.required<string>();
  readonly icon = input<string>('bi-graph-up');
  readonly preffix = input<string>('');
  readonly value = input<number>(0);
  readonly decimals = input<number>(2);
  readonly trend = input<number | null>(null);
  readonly loading = input<boolean>(false);

  protected readonly displayValue = signal(0);

  constructor() {
    effect(() => {
      const rawValue = this.value();

      if (rawValue === null || this.loading()) {
        return;
      }

      const target = Number(rawValue) || 0;
      const currentDisplay = untracked(() => this.displayValue());

      if (target === currentDisplay) {
        return;
      }

      this.animateTo(target);
    });
  }

  protected get formattedValue(): string {
    return this.displayValue().toFixed(this.decimals());
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
