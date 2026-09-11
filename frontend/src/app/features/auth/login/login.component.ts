import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AUTH_MESSAGES } from '@core/_utilities/constants';
import { TokenStorageService } from '@core/services/token-storage.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected errorMessage: string | null = null;

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;

    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: ({ access_token }) => {
        this.tokenStorage.setToken(access_token);
        this.router.navigate(['/expenses']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.detail ?? AUTH_MESSAGES.LOGIN_FAILED;
      },
    });
  }
}
