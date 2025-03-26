import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { TodoRequestModel } from '../_model/request/todo-request.model';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TodoSortModalFormControl } from './_model/todo-sort-modal-form.model';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { TodoModel } from '../_model/todo.model';
import { TodoService } from '@services/todo.service';
import { todosActions } from '@state/todo/todo-actions';
import { selectFilters } from '@state/todo/todo-selectors';

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
  private readonly _todoService = inject(TodoService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store<AppState>);
  private readonly _dialogRef = inject(MatDialogRef<TodoSortModalComponent>);
  private readonly _data: { totalVisibleTodos: number } =
    inject(MAT_DIALOG_DATA);
  private readonly _selectFiltersSignal =
    this._store.selectSignal(selectFilters);

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
    formControl.column.setValue(this._selectFiltersSignal()?.orderColumn);
    formControl.direction.setValue(this._selectFiltersSignal()?.orderDirection);
    return this._formBuilder.group(formControl);
  }

  constructor() {
    this.form = this.populateForm();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { column, direction } = this.form.value;
      const request: Partial<TodoRequestModel> = {
        ...this._selectFiltersSignal(),
        orderColumn: column,
        orderDirection: direction,
        limit: this._data.totalVisibleTodos,
      };

      this.loadItems$(request).subscribe((response) => {
        this._store.dispatch(todosActions.updateFilters({ request }));

        this._dialogRef.close(response.results);
      });
    }
  }

  private loadItems$(
    request: Partial<TodoRequestModel> | null
  ): Observable<{ results: TodoModel[]; total: number }> {
    return this._todoService
      .todos$(request)
      .pipe(takeUntilDestroyed(this._destroyRef));
  }
}
