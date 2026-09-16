import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Field, FormField, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-input-phone',
  imports: [FormField, NgClass],
  templateUrl: './input-phone.component.html',
  styleUrl: './input-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPhoneComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly field = input.required<Field<string>>();
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly iconClass = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly maxLength = input<number>(10);

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

    const error: ValidationError | undefined = field().errors()[0];
    if (error?.message) {
      return error.message;
    }

    return error?.kind === 'required'
      ? `${this.label() || 'This field'} is required.`
      : 'Enter a valid value.';
  }
}
