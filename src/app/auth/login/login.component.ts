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
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { MatRippleModule } from '@angular/material/core';
import { AuthRequestModel } from '../_model/auth-request.model';
import { AuthComponent } from '../auth.component';
import { LoginFormControl } from './_model/login-form-control.model';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { from, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { UserState } from '@state/user/user-state';
import { userActions } from '@state/user/user-actions';
import { ClickOutsideDirective } from '../../directives/click-outisde-element.directive';

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
    ClickOutsideDirective,
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
  private readonly _socialAuthService = inject(SocialAuthService);
  private readonly _store = inject(Store<AppState>);
  private readonly _tokenKey = SessionStorageEnum.ACCESS_TOKEN;

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

  private storeTokenInCookie(
    token: string,
    expiryDate: Date,
    tokenKey = SessionStorageEnum.ACCESS_TOKEN,
    isSession = false
  ): void {
    let cookieOptions: CookieOptions = {
      sameSite: 'Lax',
      path: '/',
      domain: 'localhost',
    };

    if (!isSession) {
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

      cookieOptions = {
        ...cookieOptions,
        expires: utcExpireDate,
      };
    }

    this._cookieService.set(tokenKey, token, {
      ...cookieOptions,
    });
  }

  private clearAllTokens(): void {
    this._cookieService.delete(this._tokenKey);
    sessionStorage.removeItem(this._tokenKey);
  }

  // this is only triggered when use click on google button to login
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
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000); // Expiry time in milliseconds

            this._cookieService.delete(SessionStorageEnum.GOOGLE_ACCESS_TOKEN);

            this.storeTokenInCookie(
              googleUser.authToken,
              expiryDate,
              SessionStorageEnum.GOOGLE_ACCESS_TOKEN
            );

            return this._authService.loginInWithGoogle$(googleUser.idToken);
          }

          return of(null);
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((response) => {
        if (response) {
          this._store.dispatch(
            userActions.isGoogleLogin({ isGoogleLogin: true })
          );
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
    this.isFormSubmittedSignal.set(true);
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

          this.storeTokenInCookie(
            response?.data?.accessToken,
            response?.data?.expiryDate,
            undefined,
            !rememberMe
          );

          this._router.navigate(['/todos']);
        });
    }
  }
}
