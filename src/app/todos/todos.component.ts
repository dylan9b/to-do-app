import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectAllCompletedTotal,
  selectAllTodos,
  selectTodosTotal,
} from '@state/todo/todo-selectors';
import { todosActions } from '@state/todo/todo-actions';
import { AppState } from '@state/app.state';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { priorityActions } from '@state/priority/priority.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { userActions } from '@state/user/user-actions';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DecimalPipe } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TodoModel } from './_model/todo.model';
import { UpdateTodoRequestModel } from './_model/request/update-todo-request.model';
import { Animations } from '../animations/animations';
import { TodoRequestModel } from './_model/request/todo-request.model';

@Component({
  selector: 'app-todos',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TodoItemComponent,
    DecimalPipe,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  animations: [Animations.pinUnpin, Animations.completeIncomplete],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  private readonly _store = inject(Store<AppState>);
  private readonly _dialog = inject(MatDialog);
  private readonly _authService = inject(AuthService);
  private readonly _cookieService = inject(CookieService);
  private readonly totalTodoSignal = this._store.selectSignal(selectTodosTotal);
  private readonly totalTodoCompletedSignal = this._store.selectSignal(
    selectAllCompletedTotal
  );

  readonly todosSignal = this._store.selectSignal(selectAllTodos);
  readonly todoItemsLeftSignal = computed(() => {
    return this.totalTodoSignal() - this.totalTodoCompletedSignal();
  });
  readonly progressBarValueSignal = computed(
    () => (this.totalTodoCompletedSignal() / this.totalTodoSignal()) * 100
  );

  filters: Partial<TodoRequestModel> | null = {
    isCompleted: null,
    isPinned: null,
  };

  constructor() {
    this._store.dispatch(todosActions.load({ request: null }));
    this._store.dispatch(priorityActions.load());
  }

  ngOnInit(): void {
    if (this._cookieService.get(SessionStorageEnum.GOOGLE_ACCESS_TOKEN)) {
      this._store.dispatch(userActions.isGoogleLogin({ isGoogleLogin: true }));
    }
  }

  openCreateTodoModal(): void {
    import('./todo-modal/todo-modal.component').then((c) => {
      this._dialog.open(c.TodoModalComponent);
    });
  }

  openSortModal(): void {
    import('./todo-sort-modal/todo-sort-modal.component').then((c) => {
      this._dialog.open(c.TodoSortModalComponent);
    });
  }

  openSearchModal(): void {
    import('./todo-search-modal/todo-search-modal.component').then((c) => {
      this._dialog.open(c.TodoSearchModalComponent);
    });
  }

  logOut(): void {
    this._authService.logOut();
  }

  drop(event: CdkDragDrop<TodoModel>): void {
    moveItemInArray(
      this.todosSignal(),
      event.previousIndex,
      event.currentIndex
    );

    const droppedItem = this.todosSignal()[event.currentIndex];

    const request: Partial<UpdateTodoRequestModel> = {
      id: droppedItem.id,
      order: event.currentIndex + 1,
    };

    this._store.dispatch(todosActions.update({ request }));
  }

  private toggleFilter(type: string | null): void {
    switch (type) {
      case null:
        this.filters = null;
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
  }

  filter(type: 'pin' | 'complete' | null): void {
    this.toggleFilter(type);

    // remove falsy values from filters as these should not be sent to the server
    const updatedFilters = this.filters
      ? Object.fromEntries(
          Object.entries(this.filters).filter(([, value]) => Boolean(value))
        )
      : null;
    this._store.dispatch(todosActions.load({ request: updatedFilters }));
  }
}
