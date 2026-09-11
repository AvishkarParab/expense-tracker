import { Injectable, signal } from '@angular/core';

import { STORAGE_KEYS } from '@core/_utilities/constants';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private readonly authenticatedState = signal(this.hasStoredToken());
  readonly isAuthenticated = this.authenticatedState.asReadonly();

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    this.authenticatedState.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  clearToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.authenticatedState.set(false);
  }

  isLoggedIn(): boolean {
    return this.authenticatedState();
  }

  private hasStoredToken(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
}
