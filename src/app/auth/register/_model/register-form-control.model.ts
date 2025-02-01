import { FormControl, Validators } from '@angular/forms';
import { AuthFormControl } from '../../_model/auth-form-control.model';

export class RegisterFormControl extends AuthFormControl {
  constructor(
    public reTypePassword: FormControl = new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(8)])
    )
  ) {
    super();
  }
}
