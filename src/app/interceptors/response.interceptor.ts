import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoResponseModel } from '../todos/_model/response/todo-response.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  private readonly _router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _destroyRef = inject(DestroyRef);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<TodoResponseModel>) => {
        const isGoogleEvent =
          event instanceof HttpResponse &&
          event.body!.kind === 'calendar#event';

        if (
          event instanceof HttpResponse &&
          (isGoogleEvent || event.body!.message)
        ) {
          switch (event.status) {
            case 200:
              if (!isGoogleEvent) {
                this._snackBar.open(event.body!.message, 'Success');
              } else {
                this._snackBar
                  .open('Task created on google calendar', 'View')
                  .onAction()
                  .pipe(takeUntilDestroyed(this._destroyRef))
                  .subscribe(() =>
                    window.open(event!.body!.htmlLink, '_blank')
                  );
              }
              break;
            case 201:
              this._snackBar.open(event.body!.message, 'Created');
              break;
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error?.error?.messages?.error;
        switch (error.status) {
          default:
            this._snackBar.open(errorMessage, error?.statusText);
            break;
          case 401:
            this._snackBar.open(errorMessage, error?.statusText);
            this._router.navigate(['/auth', 'login']);
            break;
        }

        throw error;
      })
    );
  }
}
