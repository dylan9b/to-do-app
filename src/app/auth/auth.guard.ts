import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly _router = inject(Router);
  private readonly _cookieService = inject(CookieService);

  canActivate(): boolean {
    const token = this._cookieService.get('accessToken');

    if (!token) {
      this._router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
