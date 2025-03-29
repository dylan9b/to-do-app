import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RegisterFormControl } from './_model/register-form-control.model';
import { AuthComponent } from '../auth.component';
import { AuthRequestModel } from '../_model/auth-request.model';
import { passwordMatchValidator } from '../validator/password-validator';
import { ClickOutsideDirective } from '@directives/click-outisde-element.directive';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ClickOutsideDirective,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent extends AuthComponent {
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);

  constructor() {
    super();
    this.form = this.populateForm(new RegisterFormControl());
    this.form.addValidators(passwordMatchValidator());
    this.form.updateValueAndValidity();
  }

  onSubmit(): void {
    this.isFormSubmittedSignal.set(true);

    if (this.form.valid) {
      const { email, password } = this.form.value;
      const request: AuthRequestModel = {
        email,
        password,
      };

      this._authService
        .register$(request)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((response) => {
          if (response.success) {
            this._router.navigate(['/auth', 'login']);
          }
        });
    }
  }
}
