import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable } from 'rxjs';
import { LoginResponseModel } from '@auth/login/_model/login-response.model';
import { environment } from '../environment/environment';
import { RegisterResponseModel } from '@auth/register/_model/register-response.model';
import { AuthRequestModel } from '@auth/_model/auth-request.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { PlatformService } from './platform.service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { userActions } from '@state/user/user-actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _cookieService = inject(CookieService);
  private readonly _router = inject(Router);
  private readonly _platformService = inject(PlatformService);
  private readonly _socialAuthService = inject(SocialAuthService);
  private readonly _store = inject(Store<AppState>);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _tokenKey = SessionStorageEnum.ACCESS_TOKEN;

  loginInWithGoogle$(tokenId: string): Observable<LoginResponseModel> {
    return this._http
      .post<LoginResponseModel>(`${environment.apiUrl}login-google.php`, {
        tokenId,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  login$(request: AuthRequestModel): Observable<LoginResponseModel> {
    return this._http
      .post<LoginResponseModel>(`${environment.apiUrl}login.php`, {
        ...request,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  register$(request: AuthRequestModel): Observable<RegisterResponseModel> {
    return this._http
      .post<LoginResponseModel>(`${environment.apiUrl}register.php`, {
        ...request,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          throw err;
        })
      );
  }

  logoutFromGoogle$(): Observable<boolean> {
    return from(this._socialAuthService.signOut()).pipe(
      map(() => {
        return true;
      }),
      catchError((err) => {
        throw err;
      })
    );
  }

  logOut(): void {
    from(this._router.navigate(['/auth', 'login']))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._store.dispatch(userActions.logout());
        this._cookieService.delete(SessionStorageEnum.GOOGLE_ACCESS_TOKEN);
        this._cookieService.delete(this._tokenKey);
        this._platformService.removeItemSessionStorage(this._tokenKey);
      });
  }
}
