import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        if (error.status === 401) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('current_user');
          router.navigate(['/login']);
          errorMessage = 'Session expired. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found.';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error. Please try again later.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors && error.error.errors.length > 0) {
          errorMessage = error.error.errors[0].msg;
        }
      }

      return throwError(() => ({
        ...error,
        userMessage: errorMessage
      }));
    })
  );
};
