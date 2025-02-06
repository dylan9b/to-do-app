import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllTodos } from '@state/todo/todo-selectors';
import { todosActions } from '@state/todo/todo-actions';
import { AppState } from '@state/app.state';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { priorityActions } from '@state/priority/priority.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-todos',
  imports: [FormsModule, MatButtonModule, MatIconModule, TodoItemComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {
  private readonly _store = inject(Store<AppState>);
  private readonly _dialog = inject(MatDialog);
  private readonly _authService = inject(AuthService);

  readonly todosSignal = this._store.selectSignal(selectAllTodos);

  constructor() {
    this._store.dispatch(todosActions.load({ request: null }));
    this._store.dispatch(priorityActions.load());
  }

  openCreateTodoModal(): void {
    import('./todo-modal/todo-modal.component').then((c) => {
      this._dialog.open(c.TodoModalComponent);
    });
  }

  logOut(): void {
    this._authService.logOut();
  }
}
