import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { TodoRequestModel } from '../_model/request/todo-request.model';
import { todosActions } from '@state/todo/todo-actions';
import { selectSearchTerm } from '@state/todo/todo-selectors';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-todo-search-modal',
  imports: [MatDialogModule, FormsModule, MatInputModule, CommonModule],
  templateUrl: './todo-search-modal.component.html',
  styleUrl: './todo-search-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoSearchModalComponent {
  private readonly _store = inject(Store<AppState>);
  private readonly _dialogRef = inject(MatDialogRef<TodoSearchModalComponent>);

  searchTermSignal = this._store.selectSignal(selectSearchTerm);

  filterBySearchTerm(searchTerm: Event): void {
    const value = (searchTerm.target as HTMLInputElement).value;

    const request: Partial<TodoRequestModel> = {
      searchTerm: value,
    };

    this._store.dispatch(todosActions.load({ request }));
    this._dialogRef.close();
  }
}
