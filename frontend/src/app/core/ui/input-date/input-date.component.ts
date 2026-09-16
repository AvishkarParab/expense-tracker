import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [FormField, NgClass],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDateComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly field = input.required<Field<string | null>>();

  readonly label = input<string>('');
  readonly iconClass = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);

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
      : 'Select a valid date.';
  }
}
