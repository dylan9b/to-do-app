import { FormControl } from '@angular/forms';
import { AuthFormControl } from '../../_model/auth-form-control.model';

export class LoginFormControl extends AuthFormControl {
  constructor(public rememberMe: FormControl = new FormControl(false)) {
    super();
  }
}
