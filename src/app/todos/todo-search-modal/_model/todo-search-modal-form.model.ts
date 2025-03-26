import { FormControl } from '@angular/forms';

export class TodoSearchModalFormControl {
  constructor(public searchTerm: FormControl = new FormControl(null)) {}
}
