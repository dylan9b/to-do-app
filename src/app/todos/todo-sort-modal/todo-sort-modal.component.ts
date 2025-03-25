import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { todosActions } from '@state/todo/todo-actions';
import { TodoRequestModel } from '../_model/request/todo-request.model';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TodoSortModalFormControl } from './_model/todo-sort-modal-form.model';
import { MatIconModule } from '@angular/material/icon';
import {
  selectColumnSort,
  selectColumnSortDirection,
} from '@state/todo/todo-selectors';

@Component({
  selector: 'app-todo-sort-modal',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './todo-sort-modal.component.html',
  styleUrl: './todo-sort-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoSortModalComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store<AppState>);
  private readonly _dialogRef = inject(MatDialogRef<TodoSortModalComponent>);

  private readonly columnSortSignal =
    this._store.selectSignal(selectColumnSort);
  private readonly columnSortDirectionSignal = this._store.selectSignal(
    selectColumnSortDirection
  );

  form!: FormGroup;

  readonly columns = [
    {
      key: 'title',
      value: 'Title',
    },
    {
      key: 'isCompleted',
      value: 'Completed',
    },
    {
      key: 'isPinned',
      value: 'Pinned',
    },
    {
      key: 'dueDate',
      value: 'Due date',
    },
    {
      key: 'createdAt',
      value: 'Created at',
    },
    {
      key: 'updatedAt',
      value: 'Updated at',
    },
    {
      key: 'priorityId',
      value: 'Priority',
    },
  ];
  readonly directions = ['ASC', 'DESC'];

  private populateForm(): FormGroup {
    const formControl = new TodoSortModalFormControl();
    formControl.column.setValue(this.columnSortSignal());
    formControl.direction.setValue(this.columnSortDirectionSignal());
    return this._formBuilder.group(formControl);
  }

  constructor() {
    this.form = this.populateForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { column, direction } = this.form.value;
      const request: Partial<TodoRequestModel> = {
        orderColumn: column,
        orderDirection: direction,
      };

      this._store.dispatch(todosActions.load({ request }));
      this._dialogRef.close();
    }
  }
}
