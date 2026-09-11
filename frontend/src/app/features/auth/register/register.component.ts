import { Component, computed, effect, inject, signal } from '@angular/core';
import { email, form, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AUTH_MESSAGES, RESULT_KINDS } from '@core/_utilities/constants';
import { LoaderService } from '@core/services';
import { FormErrorsComponent, InputTextComponent } from '@core/ui';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  imports: [FormErrorsComponent, FormRoot, InputTextComponent, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly registerService = inject(RegisterService);
  private readonly router = inject(Router);
  private readonly loaderService = inject(LoaderService);

  protected readonly registerModel = signal({ email: '', password: '' });
  protected readonly registerForm = form(
    this.registerModel,
    (schema) => {
      required(schema.email);
      email(schema.email);
      required(schema.password);
      minLength(schema.password, 8);
    },
    {
      submission: {
        action: () => this.submitRegistration(),
      },
    },
  );

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly isSubmitting = computed(() => this.loaderService.isLoading('register-submit'));

  constructor() {
    effect(() => {
      this.registerModel();
      if (this.errorMessage()) {
        this.errorMessage.set(null);
      }
    });
  }

  private async submitRegistration(): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const result = await firstValueFrom(
      this.registerService.register(this.registerModel(), {
        showLoader: true,
        sender: 'register-submit',
      }),
    );
    if (result.kind === RESULT_KINDS.ERROR) {
      this.errorMessage.set(
        result.error.details ?? AUTH_MESSAGES.REGISTRATION_FAILED,
      );
      return;
    }

    this.successMessage.set(AUTH_MESSAGES.REGISTRATION_SUCCESS);
    setTimeout(() => void this.router.navigate(['/login']), 1000);
  }
}
