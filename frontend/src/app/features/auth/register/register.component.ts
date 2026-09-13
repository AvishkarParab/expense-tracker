import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormRoot, form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

import { AUTH_MESSAGES, RESULT_KINDS } from '@core/_utilities/constants';
import { LoaderService } from '@core/services';
import { FormErrorsComponent, InputTextComponent } from '@core/ui';
import { RegisterService } from './register.service';
import { registerFormInitialState, registerFormSchema, RegisterFormModel } from './_models';

@Component({
  selector: 'app-register',
  imports: [FormErrorsComponent, FormRoot, InputTextComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly registerService = inject(RegisterService);
  private readonly loaderService = inject(LoaderService);
  private readonly router = inject(Router);

  protected readonly registerModel = signal<RegisterFormModel>(registerFormInitialState);
  protected readonly registerForm = form(this.registerModel, registerFormSchema, {
    submission: {
      action: () => this.submitRegistration(),
    },
  });

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly isSubmitting = computed(() => this.loaderService.isLoading('register-submit'));

  private async submitRegistration(): Promise<void> {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const result = await firstValueFrom(
      this.registerService.register$(this.registerModel(), {
        showLoader: true,
        sender: 'register-submit',
      }),
    );

    if (result.kind === RESULT_KINDS.ERROR) {
      this.errorMessage.set(result.error.details ?? AUTH_MESSAGES.REGISTRATION_FAILED);
      return;
    }

    this.successMessage.set(AUTH_MESSAGES.REGISTRATION_SUCCESS);
    setTimeout(() => void this.router.navigate(['/login']), 1000);
  }
}
