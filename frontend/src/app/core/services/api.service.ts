import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { HTTP_CONTENT_TYPES } from '@core/_utilities/constants';
import { TokenStorageService } from './token-storage.service';

type QueryParams = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http.get<T>(this.url(path), {
      headers: this.headers(),
      params: this.queryParams(params),
    });
  }

  post<TResponse, TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.url(path), body, {
      headers: this.headers(),
    });
  }

  postForm<TResponse>(
    path: string,
    body: Record<string, string>,
  ): Observable<TResponse> {
    const formBody = new URLSearchParams();

    Object.entries(body).forEach(([key, value]) => {
      formBody.set(key, value);
    });

    return this.http.post<TResponse>(this.url(path), formBody.toString(), {
      headers: this.headers(HTTP_CONTENT_TYPES.FORM_URLENCODED),
    });
  }

  patch<TResponse, TBody>(path: string, body: TBody): Observable<TResponse> {
    return this.http.patch<TResponse>(this.url(path), body, {
      headers: this.headers(),
    });
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http.delete<TResponse>(this.url(path), {
      headers: this.headers(),
    });
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }

  private headers(
    contentType: string = HTTP_CONTENT_TYPES.JSON,
  ): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': contentType });
    const token = this.tokenStorage.getToken();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private queryParams(params?: QueryParams): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }
}
