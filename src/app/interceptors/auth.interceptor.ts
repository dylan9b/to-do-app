import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly _cookieService = inject(CookieService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const skipIntercept = req.headers.has('skip');
    let cloned: HttpRequest<unknown>;

    if (skipIntercept) {
      cloned = req.clone({
        headers: req.headers.delete('skip'),
      });

      return next.handle(cloned);
    } else {
      const accessToken = this._cookieService.get(
        SessionStorageEnum.ACCESS_TOKEN
      );

      if (accessToken) {
        cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        });

        return next.handle(cloned);
      } else {
        return next.handle(req);
      }
    }
  }
}
