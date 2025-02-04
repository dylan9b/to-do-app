import { FormControl } from '@angular/forms';

export class TodoCreateModalFormControl {
  constructor(
    public title: FormControl = new FormControl(null),
    public dueDate: FormControl = new FormControl(null),
    public priorityId: FormControl = new FormControl(null)
  ) {}
}
