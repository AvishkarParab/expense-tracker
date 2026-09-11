import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AuthResponseDto,
  LoginRequestDto,
} from '@models/_dtos/auth.dto';
import { API_ENDPOINTS } from '@core/_utilities/constants';
import { ApiService } from '@core/services';
import { RequestConfiguration, ResultKind } from '@core/models';
import { toResultKind$ } from '@core/models/_operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiService = inject(ApiService);

  login(
    credentials: LoginRequestDto,
    configuration?: RequestConfiguration,
  ): Observable<ResultKind<AuthResponseDto>> {
    return this.apiService.postForm<AuthResponseDto>(API_ENDPOINTS.AUTH.LOGIN, {
      username: credentials.username,
      password: credentials.password,
    }, configuration).pipe(toResultKind$());
  }
}
