import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [FormField, NgClass],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly field = input.required<Field<number>>();
  readonly label = input<string>('');
  readonly type = input<'number' | 'amount' | 'quantity'>('number');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('');
  readonly iconClass = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly maxLength = input<number>(12);

  protected readonly step = computed(() => {
    const inputType = this.type();
    if (inputType === 'amount') return '0.01';
    if (inputType === 'quantity') return '1';
    return 'any';
  });

  // NEW: Block 'e', 'E', '+', and '-' natively allowed by type="number"
  protected preventInvalidChars(event: KeyboardEvent): void {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  protected enforceMaxLength(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const max = this.maxLength();

    if (inputEl.value && inputEl.value.length > max) {
      inputEl.value = inputEl.value.slice(0, max);
    }
  }

  protected get validationMessage(): string | null {
    const field = this.field();
    if (!field().touched() || !field().invalid()) {
      return null;
    }

    const error = field().errors()[0];
    if (error?.message) {
      return error.message;
    }

    return error?.kind === 'required'
      ? `${this.label() || 'This field'} is required.`
      : 'Enter a valid value.';
  }
}
