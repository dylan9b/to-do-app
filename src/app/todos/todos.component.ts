import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllTodos } from '../state/todo/todo-selectors';
import { todosActions } from '../state/todo/todo-actions';
import { AppState } from '../state/app.state';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { priorityActions } from '../state/priority/priority.actions';

@Component({
  selector: 'app-todos',
  imports: [FormsModule, TodoItemComponent],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  standalone: true,
})
export class TodosComponent {
  private readonly _store = inject(Store<AppState>);

  todosSignal = this._store.selectSignal(selectAllTodos);

  constructor() {
    this._store.dispatch(todosActions.load({ request: null }));
    this._store.dispatch(priorityActions.load());
  }
}
