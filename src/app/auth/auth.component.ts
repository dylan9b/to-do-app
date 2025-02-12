import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthFormControl } from './_model/auth-form-control.model';

@Component({
  selector: 'app-auth',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  form!: FormGroup;

  private readonly _formBuilder = inject(FormBuilder);

  hidePasswordSignal = signal(true);
  isFormSubmittedSignal = signal(false);

  togglePassword(event: MouseEvent) {
    event.stopPropagation();
    this.hidePasswordSignal.set(!this.hidePasswordSignal());
  }

  populateForm(formControl: AuthFormControl): FormGroup {
    return this._formBuilder.group(formControl);
  }

  onClickOutside(event: MouseEvent): void {
    event.stopPropagation();
    this.isFormSubmittedSignal.set(false);
  }
}
