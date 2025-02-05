import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginFormControl } from './_model/login-form-control.model';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthComponent } from '../auth.component';
import { AuthRequestModel } from '../_model/auth-request.model';
import { MatRippleModule } from '@angular/material/core';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends AuthComponent {
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cookieService = inject(CookieService);
  private readonly _router = inject(Router);

  constructor() {
    super();
    this.form = this.populateForm(new LoginFormControl());
  }

  private storeTokenInSession(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }

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

    this._cookieService.set('accessToken', token, {
      expires: utcExpireDate,
      sameSite: 'Lax',
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
          if (rememberMe) {
            this.storeTokenInCookie(
              response?.data?.accessToken,
              response?.data?.expiryDate
            );
          } else {
            this.storeTokenInSession(response?.data?.accessToken);
          }
          this._router.navigate(['/todos']);
        });
    }
  }
}
