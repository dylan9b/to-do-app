import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  private readonly _router = inject(Router);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different status codes
        if (error.status === 401) {
          // Unauthorized, redirect to login
          sessionStorage.removeItem('accessToken');
          this._router.navigate(['/auth', 'login']);
          console.log('Unauthorized, redirecting to login...');
          // You can navigate to the login page here
        } else if (error.status === 500) {
          // Internal Server Error
          console.log('Internal Server Error occurred.');
          // Handle server error
        } else if (error.status === 403) {
          // Forbidden error
          console.log('Access Forbidden!');
        }

        // You can throw or return a new error based on the status code
        throw error;
      })
    );
  }
}
