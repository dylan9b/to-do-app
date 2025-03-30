import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { userActions } from '@state/user/user-actions';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DecimalPipe, NgClass } from '@angular/common';
import { Animations } from '../animations/animations';
import { TodoRequestModel } from './_model/request/todo-request.model';
import { TodoService } from '@services/todo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TodoModel } from './_model/todo.model';
import { Observable } from 'rxjs';
import { todosActions } from '@state/todo/todo-actions';
import { selectFilters } from '@state/todo/todo-selectors';

@Component({
  selector: 'app-todos',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TodoItemComponent,
    DecimalPipe,
    NgClass,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  animations: [Animations.pinUnpin, Animations.completeIncomplete],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _store = inject(Store<AppState>);
  private readonly _dialog = inject(MatDialog);
  private readonly _authService = inject(AuthService);
  private readonly _cookieService = inject(CookieService);
  private readonly _todoService = inject(TodoService);
  private readonly _selectFiltersSignal =
    this._store.selectSignal(selectFilters);

  readonly todoItemsLeftSignal = computed(() => {
    return (
      this.todosSignal().length -
      this.todosSignal().filter((todo) => todo.isCompleted).length
    );
  });
  readonly progressBarValueSignal = computed(
    () =>
      (this.todosSignal().filter((todo) => todo.isCompleted).length /
        this.todosSignal().length) *
      100
  );

  readonly disableLoadMoreSignal = computed(() => {
    const isLimitReached =
      this.todosSignal().length === this.totalTodosSignal();
    return isLimitReached;
  });

  filters: Partial<TodoRequestModel> | null = {
    isCompleted: null,
    isPinned: null,
  };
  offset = 0;
  isLoaded = false;
  readonly todosSignal = signal<TodoModel[]>([]);
  readonly totalTodosSignal = signal<number>(0);

  private loadItems$(
    request: Partial<TodoRequestModel> | null
  ): Observable<{ results: TodoModel[]; total: number }> {
    return this._todoService
      .todos$(request)
      ?.pipe(takeUntilDestroyed(this._destroyRef));
  }

  ngOnInit(): void {
    this.loadItems$({ limit: 5, offset: this.offset })?.subscribe(
      (response) => {
        if (response?.total && response?.results) {
          this.totalTodosSignal.set(response.total);
          this.todosSignal.set(response.results);
          this.offset += 5;

          this.isLoaded = true;
        }
      }
    );
    if (this._cookieService.get(SessionStorageEnum.GOOGLE_ACCESS_TOKEN)) {
      this._store.dispatch(userActions.isGoogleLogin({ isGoogleLogin: true }));
    }
  }

  openCreateTodoModal(): void {
    import('./todo-modal/todo-modal.component').then((c) => {
      const dialog = this._dialog.open(c.TodoModalComponent);

      dialog
        .afterClosed()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((todo: TodoModel) => {
          if (todo) {
            this.todosSignal.set([todo, ...this.todosSignal()].slice(0, 5));
            this.totalTodosSignal.set(this.totalTodosSignal() + 1);
          }
        });
    });
  }

  openSortModal(): void {
    import('./todo-sort-modal/todo-sort-modal.component').then((c) => {
      const dialog = this._dialog.open(c.TodoSortModalComponent, {
        data: {
          totalVisibleTodos: this.todosSignal().length,
        },
      });
      dialog
        .afterClosed()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((result) => {
          if (result) {
            this.todosSignal.set(result);
          }
        });
    });
  }

  openSearchModal(): void {
    import('./todo-search-modal/todo-search-modal.component').then((c) => {
      const dialog = this._dialog.open(c.TodoSearchModalComponent);
      dialog
        .afterClosed()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((result) => {
          if (result) {
            this.todosSignal.set(result);
          }
        });
    });
  }

  logOut(): void {
    this._authService.logOut();
  }

  private toggleFilter(type: string | null): void {
    switch (type) {
      case null:
        this.filters = {
          ...this.filters,
          isCompleted: null,
          isPinned: null,
        };
        break;
      case 'pin':
        this.filters = {
          ...this.filters,
          isPinned: !this.filters?.isPinned,
        };

        break;
      case 'complete':
        this.filters = {
          ...this.filters,
          isCompleted: !this.filters?.isCompleted,
        };
        break;
    }

    this.filters = {
      ...this._selectFiltersSignal(),
      ...this.filters,
    };

    this._store.dispatch(todosActions.updateFilters({ request: this.filters }));
  }

  filter(type: 'pin' | 'complete' | null): void {
    this.toggleFilter(type);

    // remove falsy values from filters as these should not be sent to the server
    let updatedFilters = this.filters
      ? Object.fromEntries(
          Object.entries(this.filters).filter(([, value]) => Boolean(value))
        )
      : {};

    updatedFilters = {
      ...updatedFilters,
      limit: this.offset,
    };

    if (type === null || !Object.entries(updatedFilters).length) {
      this.loadItems$({ limit: 5, offset: 0 })?.subscribe((response) => {
        this.todosSignal.set(response.results);
      });
      this.offset = 5;
    } else {
      this.loadItems$(updatedFilters)?.subscribe((response) => {
        this.todosSignal.set(response.results);
      });
    }
  }

  updateTodo(todo: TodoModel): void {
    const todos = this.todosSignal().map((t) => {
      if (t.id === todo.id) {
        return todo;
      }
      return t;
    });
    this.todosSignal.set(todos);
  }

  removeTodo(id: string): void {
    this.todosSignal.update((todos) => todos.filter((todo) => todo.id !== id));
    this.totalTodosSignal.set(this.totalTodosSignal() - 1);
    this.filter(null);
  }

  loadMore(): void {
    let updatedFilters = this.filters
      ? Object.fromEntries(
          Object.entries(this.filters).filter(([, value]) => Boolean(value))
        )
      : {};

    updatedFilters = {
      ...updatedFilters,
      limit: 5,
      offset: this.offset,
    };

    this.loadItems$(updatedFilters)?.subscribe((response) => {
      const updatedTodos = [...this.todosSignal(), ...response.results];
      this.todosSignal.set(updatedTodos);
      this.offset += 5;
    });
  }
}
