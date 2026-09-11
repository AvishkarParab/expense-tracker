import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AuthResponseDto,
  LoginRequestDto,
} from '@models/_dtos/auth.dto';
import { API_ENDPOINTS } from '@core/_utilities/constants';
import { ApiService } from '@core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiService = inject(ApiService);

  login(credentials: LoginRequestDto): Observable<AuthResponseDto> {
    return this.apiService.postForm<AuthResponseDto>(API_ENDPOINTS.AUTH.LOGIN, {
      username: credentials.username,
      password: credentials.password,
    });
  }
}
