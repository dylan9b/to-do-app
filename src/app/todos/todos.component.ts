import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAllTodos } from '../state/selectors';
import { TodosActions } from '../state/actions';
import { AppState } from '../state/app.state';

@Component({
  selector: 'app-todos',
  imports: [FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  standalone: true,
})
export class TodosComponent {
  private readonly _store = inject(Store<AppState>);

  todosSignal = this._store.selectSignal(selectAllTodos);

  constructor() {
    this._store.dispatch(TodosActions.load({ request: null }));
  }
}
