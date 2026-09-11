import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AUTH_MESSAGES } from '@core/_utilities/constants';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);

  protected readonly registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected errorMessage: string | null = null;
  protected successMessage: string | null = null;

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    this.registerService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.successMessage = AUTH_MESSAGES.REGISTRATION_SUCCESS;
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.detail ?? AUTH_MESSAGES.REGISTRATION_FAILED;
      },
    });
  }
}
