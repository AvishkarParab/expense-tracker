import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  RegisterRequestDto,
  UserResponseDto,
} from '@models/_dtos/auth.dto';
import { API_ENDPOINTS } from '@core/_utilities/constants';
import { ApiService } from '@core/services';
import { RequestConfiguration, ResultKind } from '@core/models';
import { toResultKind$ } from '@core/models/_operators';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly apiService = inject(ApiService);

  register(
    payload: RegisterRequestDto,
    configuration?: RequestConfiguration,
  ): Observable<ResultKind<UserResponseDto>> {
    return this.apiService.post<UserResponseDto, RegisterRequestDto>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
      configuration,
    ).pipe(toResultKind$());
  }
}
