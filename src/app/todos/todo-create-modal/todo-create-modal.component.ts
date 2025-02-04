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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

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

  form!: FormGroup;

  constructor() {
    this.form = this.populateFormControl();
  }

  private populateFormControl(): FormGroup {
    const form = new TodoCreateModalFormControl();
    return this._formBuilder.group(form);
  }

  onSubmit(): void {
    const { dueDate, title, priorityId } = this.form.value;
    const date = this._datePipe.transform(
      dueDate,
      'YYYY-MM-dd'
    ) as string;

    const request: CreateTodoRequestModel = {
      dueDate: date,
      title,
      priorityId,
    };

    if (this.form.valid) {
      this._store.dispatch(todosActions.create({ request }));
    }

    this._dialog.closeAll();
  }
}
