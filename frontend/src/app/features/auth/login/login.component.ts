import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormRoot, form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AUTH_MESSAGES, RESULT_KINDS } from '@core/_utilities/constants';
import { LoaderService, TokenStorageService } from '@core/services';
import { FormErrorsComponent, InputTextComponent } from '@core/ui';
import { LoginService } from './login.service';
import { loginFormInitialState, loginFormSchema, LoginFormModel } from './_models';

@Component({
  selector: 'app-login',
  imports: [FormErrorsComponent, FormRoot, InputTextComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly loaderService = inject(LoaderService);
  private readonly router = inject(Router);

  protected readonly loginModel = signal<LoginFormModel>(loginFormInitialState);
  protected readonly loginForm = form(this.loginModel, loginFormSchema, {
    submission: {
      action: () => this.submitLogin(),
    },
  });

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isSubmitting = computed(() => this.loaderService.isLoading('login-submit'));

  private async submitLogin(): Promise<void> {
    this.errorMessage.set(null);

    const result = await firstValueFrom(this.loginService.login(this.loginModel()));

    if (result.kind === RESULT_KINDS.ERROR) {
      this.errorMessage.set(
        result.error.details ?? AUTH_MESSAGES.LOGIN_FAILED,
      );
      return;
    }

    this.tokenStorage.setToken(result.data.access_token);
    void this.router.navigate(['/expenses']);
  }
}
