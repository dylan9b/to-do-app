import { inject, Injectable } from '@angular/core';
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
import { PlatformService } from '@services/platform.service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  private readonly _router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _platformService = inject(PlatformService);

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
                this._snackBar.open(event.body!.message, 'Success', {
                  duration: 3000,
                });
              } else {
                this._snackBar
                  .open('Task created on google calendar', 'View')
                  .onAction()
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
        switch (error.status) {
          case 401:
            this._platformService.removeItemSessionStorage(
              SessionStorageEnum.ACCESS_TOKEN
            );
            this._snackBar.open(error?.error?.message, 'Aunautorized');
            this._router.navigate(['/auth', 'login']);
            break;
          case 500:
            console.log('Internal Server Error occurred.');
            this._snackBar.open(error?.error?.message, 'Server Error');
            break;
          case 403:
            console.log('Access Forbidden!');
            this._snackBar.open(error?.error?.message, 'Access Forbidden');
            break;
        }

        throw error;
      })
    );
  }
}
