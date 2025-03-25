import { FormControl } from '@angular/forms';

export class TodoSortModalFormControl {
  constructor(
    public column: FormControl = new FormControl(null),
    public direction: FormControl = new FormControl(null)
  ) {}
}
