import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrl: './form-errors.component.scss',
})
export class FormErrorsComponent {
  readonly serverError = input<string | null>(null);
}
