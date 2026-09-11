import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { defer, finalize, Observable } from 'rxjs';

import { environment } from '@env/environment';
import { HTTP_CONTENT_TYPES } from '@core/_utilities/constants';
import { RequestConfiguration } from '@core/models';
import { TokenStorageService } from './token-storage.service';
import { LoaderService } from './loader.service';

type QueryParams = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly loaderService = inject(LoaderService);
  private readonly baseUrl = environment.apiUrl;

  get<T>(
    path: string,
    params?: QueryParams,
    configuration?: RequestConfiguration,
  ): Observable<T> {
    return this.withLoader(this.http.get<T>(this.url(path), {
      headers: this.headers(),
      params: this.queryParams(params),
    }), configuration);
  }

  post<TResponse, TBody>(
    path: string,
    body: TBody,
    configuration?: RequestConfiguration,
  ): Observable<TResponse> {
    return this.withLoader(this.http.post<TResponse>(this.url(path), body, {
      headers: this.headers(),
    }), configuration);
  }

  postForm<TResponse>(
    path: string,
    body: Record<string, string>,
    configuration?: RequestConfiguration,
  ): Observable<TResponse> {
    const formBody = new URLSearchParams();

    Object.entries(body).forEach(([key, value]) => {
      formBody.set(key, value);
    });

    return this.withLoader(this.http.post<TResponse>(this.url(path), formBody.toString(), {
      headers: this.headers(HTTP_CONTENT_TYPES.FORM_URLENCODED),
    }), configuration);
  }

  patch<TResponse, TBody>(
    path: string,
    body: TBody,
    configuration?: RequestConfiguration,
  ): Observable<TResponse> {
    return this.withLoader(this.http.patch<TResponse>(this.url(path), body, {
      headers: this.headers(),
    }), configuration);
  }

  delete<TResponse>(
    path: string,
    configuration?: RequestConfiguration,
  ): Observable<TResponse> {
    return this.withLoader(this.http.delete<TResponse>(this.url(path), {
      headers: this.headers(),
    }), configuration);
  }

  private withLoader<T>(
    request$: Observable<T>,
    configuration?: RequestConfiguration,
  ): Observable<T> {
    const sender = configuration?.showLoader === true
      ? configuration.sender
      : undefined;

    return defer(() => {
      this.loaderService.start(sender);
      return request$.pipe(
        finalize(() => this.loaderService.stop(sender)),
      );
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
