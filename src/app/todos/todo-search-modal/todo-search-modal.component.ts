import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { TodoRequestModel } from '../_model/request/todo-request.model';
import { selectFilters } from '@state/todo/todo-selectors';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { TodoModel } from '../_model/todo.model';
import { TodoService } from '@services/todo.service';
import { MatIconModule } from '@angular/material/icon';
import { TodoSearchModalFormControl } from './_model/todo-search-modal-form.model';
import { todosActions } from '@state/todo/todo-actions';
@Component({
  selector: 'app-todo-search-modal',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './todo-search-modal.component.html',
  styleUrl: './todo-search-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoSearchModalComponent {
  private readonly _store = inject(Store<AppState>);
  private readonly _dialogRef = inject(MatDialogRef<TodoSearchModalComponent>);
  private readonly _todoService = inject(TodoService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _selectFiltersSignal =
    this._store.selectSignal(selectFilters);

  form!: FormGroup;

  constructor() {
    this.form = this.populateForm();
  }

  private populateForm(): FormGroup {
    const form = new TodoSearchModalFormControl();
    form.searchTerm.setValue(this._selectFiltersSignal()?.searchTerm);
    return this._formBuilder.group(form);
  }

  private loadItems$(
    request: Partial<TodoRequestModel> | null
  ): Observable<{ results: TodoModel[]; total: number }> {
    return this._todoService
      .todos$(request)
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { searchTerm } = this.form.value;

      const request: Partial<TodoRequestModel> = {
        ...this._selectFiltersSignal(),
        searchTerm,
      };

      this.loadItems$(request).subscribe((response) => {
        this._store.dispatch(todosActions.updateFilters({ request }));
        this._dialogRef.close(response.results);
      });
    }
  }
}
