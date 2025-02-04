import { FormControl, Validators } from '@angular/forms';

export class TodoCreateModalFormControl {
  constructor(
    public id: FormControl = new FormControl(null),
    public title: FormControl = new FormControl(null, [Validators.required]),
    public dueDate: FormControl = new FormControl(null),
    public priorityId: FormControl = new FormControl(null),
    public isCompleted: FormControl = new FormControl(null)
  ) {}
}
