import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { PlatformService } from '@services/platform.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly _cookieService = inject(CookieService);
  private readonly _router = inject(Router);
  private readonly _platformService = inject(PlatformService);

  canActivate(): boolean {
    const token = this._cookieService.get(SessionStorageEnum.ACCESS_TOKEN);
    if (this._platformService.isBrowser) {
      if (!token) {
        this._router.navigate(['/auth', 'login']);
        return false;
      }

      return true;
    }
    return false;
  }
}
