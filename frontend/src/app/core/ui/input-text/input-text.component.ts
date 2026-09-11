import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Field, FormField, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [FormField, NgClass],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly field = input.required<Field<string>>();
  readonly label = input<string>('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string>('');
  readonly iconClass = input<string>('');

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
