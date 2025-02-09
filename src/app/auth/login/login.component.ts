import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatRippleModule } from '@angular/material/core';
import { AuthRequestModel } from '../_model/auth-request.model';
import { AuthComponent } from '../auth.component';
import { LoginFormControl } from './_model/login-form-control.model';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { PlatformService } from '@services/platform.service';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { from, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { UserState } from '@state/user/user-state';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatRippleModule,
    GoogleSigninButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends AuthComponent implements OnInit {
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cookieService = inject(CookieService);
  private readonly _router = inject(Router);
  private readonly _platformService = inject(PlatformService);
  private readonly _socialAuthService = inject(SocialAuthService);
  private readonly _store = inject(Store<AppState>);

  private readonly tokenKey = SessionStorageEnum.ACCESS_TOKEN;

  constructor() {
    super();
    this.form = this.populateForm(new LoginFormControl());
  }

  ngOnInit(): void {
    this.initiateGoogleSignIn();
  }

  isLoggedoutSignal = this._store.selectSignal(
    (state: UserState) => state.isLoggedOut
  );

  private storeTokenInCookie(token: string, expiryDate: Date): void {
    const expireDate = new Date(expiryDate);

    const utcExpireDate = new Date(
      Date.UTC(
        expireDate.getFullYear(),
        expireDate.getMonth(),
        expireDate.getDate(),
        expireDate.getHours(),
        expireDate.getMinutes(),
        expireDate.getSeconds()
      )
    );

    this._cookieService.set(this.tokenKey, token, {
      expires: utcExpireDate,
      sameSite: 'Lax',
      path: '/',
      domain: 'localhost',
    });
  }

  private clearAllTokens(): void {
    this._cookieService.delete(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  private initiateGoogleSignIn(): void {
    this._socialAuthService.authState
      .pipe(
        switchMap((googleUser) => {
          if (googleUser) {
            return from(
              this._socialAuthService.getAccessToken(
                GoogleLoginProvider.PROVIDER_ID
              )
            ).pipe(
              map((authToken) => {
                return {
                  ...googleUser,
                  authToken,
                };
              })
            );
          }

          return of(null);
        }),
        switchMap((googleUser) => {
          if (this.isLoggedoutSignal()) {
            return of(null);
          }

          if (googleUser && googleUser.idToken) {
            this._cookieService.set(
              SessionStorageEnum.GOOGLE_ACCESS_TOKEN,
              googleUser.authToken
            );
            return this._authService.loginInWithGoogle$(googleUser.idToken);
          }

          return of(null);
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response) => {
        if (response) {
          this.clearAllTokens();
          this.storeTokenInCookie(
            response?.data?.accessToken,
            response?.data?.expiryDate
          );
          this._router.navigate(['/todos']);
        }
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password, rememberMe } = this.form.value;
      const request: AuthRequestModel = {
        email,
        password,
      };

      this._authService
        .login$(request)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((response) => {
          this.clearAllTokens();

          if (rememberMe) {
            this.storeTokenInCookie(
              response?.data?.accessToken,
              response?.data?.expiryDate
            );
          } else {
            this._platformService.setItemSessionStorage(
              this.tokenKey,
              response?.data?.accessToken
            );
          }
          this._router.navigate(['/todos']);
        });
    }
  }
}
