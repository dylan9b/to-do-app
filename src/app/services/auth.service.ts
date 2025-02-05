import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { LoginResponseModel } from '../auth/login/_model/login-response.model';
import { environment } from '../environment/environment';
import { RegisterResponseModel } from '../auth/register/_model/register-response.model';
import { AuthRequestModel } from '../auth/_model/auth-request.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _cookieService = inject(CookieService);
  private readonly _router = inject(Router);
  private readonly _store = inject(Store<AppState>);

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

  logOut(): void {
    this._cookieService.delete('accessToken');
    sessionStorage.removeItem('accessToken');
    this._router.navigate(['/auth', 'login']);
  }
}
