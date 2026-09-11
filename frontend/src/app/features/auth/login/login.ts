import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginFormModel } from '@core/models/_forms/auth.form';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly showPassword = signal(false);
  protected readonly credentials: LoginFormModel = {
    email: '',
    password: '',
  };

  protected togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }
}
