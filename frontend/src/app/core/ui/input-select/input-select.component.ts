import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Field, FormField } from '@angular/forms/signals';
import { ITextValue } from '@core/models';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [FormField, NgClass, ReactiveFormsModule],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly field = input.required<Field<string | ITextValue>>();
  readonly options = input.required<ITextValue[]>();

  readonly bind = input<'value' | 'object'>('object');
  readonly label = input<string>('');
  readonly placeholder = input<string>('Select an option');
  readonly iconClass = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

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
      : 'Select a valid option.';
  }
}
