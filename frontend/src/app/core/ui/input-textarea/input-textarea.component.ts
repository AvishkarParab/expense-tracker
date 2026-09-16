import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-input-textarea',
  imports: [FormField],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextareaComponent {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly field = input.required<Field<string>>();

  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly floatingLabel = input<boolean>(false);
  readonly rows = input<number>(4);
  readonly maxLength = input<number>(500);

  protected readonly remainingCharacters = computed(() => {
    const field = this.field();
    const currentValue = field().value() || '';
    return this.maxLength() - currentValue.length;
  });

  protected enforceMaxLength(event: Event): void {
    const textareaEl = event.target as HTMLTextAreaElement;
    const max = this.maxLength();

    if (textareaEl.value && textareaEl.value.length > max) {
      textareaEl.value = textareaEl.value.slice(0, max);
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
      : 'Invalid input.';
  }
}
