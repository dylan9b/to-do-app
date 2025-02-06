import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlatformService } from '@services/platform.service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly _cookieService = inject(CookieService);
  private readonly _platformService = inject(PlatformService);

  private readonly tokenKey = SessionStorageEnum.ACCESS_TOKEN;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken =
      this._cookieService.get(this.tokenKey) ||
      this._platformService.getItemSessionStorage(this.tokenKey);

    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });

      return next.handle(cloned);
    } else {
      this._platformService.removeItemSessionStorage(this.tokenKey);
      return next.handle(req);
    }
  }
}
