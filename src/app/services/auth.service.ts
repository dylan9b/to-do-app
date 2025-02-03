import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { LoginResponseModel } from '../auth/login/_model/login-response.model';
import { environment } from '../environment/environment';
import { RegisterResponseModel } from '../auth/register/_model/register-response.model';
import { AuthRequestModel } from '../auth/_model/auth-request.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);

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
}
