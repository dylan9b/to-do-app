import { FormControl, Validators } from '@angular/forms';

export class TodoSortModalFormControl {
  constructor(
    public column: FormControl = new FormControl(null, [Validators.required]),
    public direction: FormControl = new FormControl(null, [Validators.required])
  ) {}
}
