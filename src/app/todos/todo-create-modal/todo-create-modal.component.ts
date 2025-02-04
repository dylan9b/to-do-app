import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { TodoCreateModalFormControl } from './_model/todo-create-modal-form-control.model';
import { TodosActions } from '../../state/todo/todo-actions';
import { CreateTodoRequestModel } from '../_model/request/create-todo-request.model';

@Component({
  selector: 'app-todo-create-modal',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './todo-create-modal.component.html',
  styleUrl: './todo-create-modal.component.scss',
  standalone: true,
})
export class TodoCreateModalComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store<AppState>);

  form!: FormGroup;

  constructor() {
    this.form = this.populateFormContorl();
  }

  private populateFormContorl(): FormGroup {
    const form = new TodoCreateModalFormControl();
    return this._formBuilder.group(form);
  }

  onSubmit(): void {
    const { dueDate, title, priorityId } = this.form.value;

    const request: CreateTodoRequestModel = {
      isCompleted: false,
      dueDate,
      title,
      priorityId,
    };

    if (this.form.valid) {
      this._store.dispatch(TodosActions.create({ request }));
    }
  }
}
