import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { TodoCreateModalFormControl } from './_model/todo-create-modal-form-control.model';
import { CreateTodoRequestModel } from '../_model/request/create-todo-request.model';
import { selectAllPriorities } from '../../state/priority/priority.selectors';
import { todosActions } from '../../state/todo/todo-actions';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TodoModel } from '../_model/todo.model';
import { UpdateTodoRequestModel } from '../_model/request/update-todo-request.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-todo-create-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  providers: [DatePipe],
  templateUrl: './todo-create-modal.component.html',
  styleUrl: './todo-create-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoCreateModalComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store<AppState>);
  private readonly _datePipe = inject(DatePipe);
  private readonly _dialog = inject(MatDialog);

  readonly prioritiesSignal = this._store.selectSignal(selectAllPriorities);

  readonly data?: { todo?: TodoModel | null } = inject(MAT_DIALOG_DATA);

  form!: FormGroup;

  constructor() {
    this.form = this.populateFormControl();
  }

  private populateFormControl(): FormGroup {
    const form = new TodoCreateModalFormControl();

    if (this.data?.todo?.id) {
      form.dueDate.setValue(this.data?.todo?.dueDate);
      form.id.setValue(this.data?.todo?.id);
      form.priorityId.setValue(this.data?.todo.priorityId);
      form.title.setValue(this.data?.todo?.title);
      form.isCompleted.setValue(this.data?.todo?.isCompleted);
    }

    return this._formBuilder.group(form);
  }

  onSubmit(): void {
    if (this.data?.todo?.id) {
      this.updateTodo();
    } else {
      this.createTodo();
    }

    this._dialog.closeAll();
  }

  private createTodo(): void {
    const { dueDate, title, priorityId } = this.form.value;
    const date = this._datePipe.transform(dueDate, 'YYYY-MM-dd') as string;

    const request: CreateTodoRequestModel = {
      dueDate: date,
      title,
      priorityId,
    };

    if (this.form.valid) {
      this._store.dispatch(todosActions.create({ request }));
    }
  }

  private updateTodo(): void {
    const { id, isCompleted, dueDate, title, priorityId } = this.form.value;
    const date = this._datePipe.transform(dueDate, 'YYYY-MM-dd') as string;

    const request: UpdateTodoRequestModel = {
      id,
      isCompleted,
      dueDate: date,
      title,
      priorityId,
    };

    if (this.form.valid) {
      this._store.dispatch(todosActions.update({ request }));
    }
  }
}
