import { FormControl, Validators } from '@angular/forms';

export class AuthFormControl {
  constructor(
    public email: FormControl = new FormControl(
      null,
      Validators.compose([Validators.required, Validators.email])
    ),
    public password: FormControl = new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(8)])
    )
  ) {}
}
