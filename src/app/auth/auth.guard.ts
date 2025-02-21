import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly _cookieService = inject(CookieService);
  private readonly _router = inject(Router);

  canActivate(): boolean {
    const token = this._cookieService.get(SessionStorageEnum.ACCESS_TOKEN);
    if (!token) {
      if (token.length === null || token.length === 0) {
        this._router.navigate(['/auth', 'login']);
      }
      return false;
    }

    return true;
  }
}
