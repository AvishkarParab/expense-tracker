import { HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  defer,
  map,
  OperatorFunction,
  of,
} from 'rxjs';
import { RESULT_KINDS } from '@core/_utilities/constants';
import { ResultError, ResultKind } from '../result.model';

export function toResultKind$<T>(): OperatorFunction<T, ResultKind<T>> {
  return (source) =>
    defer(() => {
      return source.pipe(
        map((data) => ({ kind: RESULT_KINDS.SUCCESS, data }) as const),
        catchError((error: unknown) =>
          of({
            kind: RESULT_KINDS.ERROR,
            error: toResultError(error),
          } as const),
        ),
      );
    });
}

function toResultError(error: unknown): ResultError {
  if (error instanceof HttpErrorResponse) {
    return {
      status: error.status,
      message: error.message,
      details: readErrorDetail(error.error),
    };
  }

  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message,
    };
  }

  return {
    status: 0,
    message: 'An unexpected error occurred.',
  };
}

function readErrorDetail(payload: unknown): string | undefined {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'detail' in payload &&
    typeof payload.detail === 'string'
  ) {
    return payload.detail;
  }

  return undefined;
}
