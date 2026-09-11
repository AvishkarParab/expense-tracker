import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  RegisterRequestDto,
  UserResponseDto,
} from '@models/_dtos/auth.dto';
import { API_ENDPOINTS } from '@core/_utilities/constants';
import { ApiService } from '@core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly apiService = inject(ApiService);

  register(payload: RegisterRequestDto): Observable<UserResponseDto> {
    return this.apiService.post<UserResponseDto, RegisterRequestDto>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
    );
  }
}
