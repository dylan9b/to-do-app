import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  Output,
} from '@angular/core';
import { TodoModel } from '../_model/todo.model';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { UpdateTodoRequestModel } from '../_model/request/update-todo-request.model';
import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isGoogleLoginSelector } from '@state/user/user-selector';
import { Animations } from '../../animations/animations';
import { TodoService } from '@services/todo.service';
import { UpdateTodoResponseModel } from '../_model/response/update-todo-response.model';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-item',
  imports: [MatIconModule, DatePipe, MatMenuModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  animations: [Animations.pinUnpin, Animations.completeIncomplete],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  private readonly _store = inject(Store<AppState>);
  private readonly _dialog = inject(MatDialog);
  private readonly _cookieService = inject(CookieService);
  private readonly _httpClient = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _todoService = inject(TodoService);

  readonly todoSignal = input.required<TodoModel>();
  readonly isGoogleLoginSignal = this._store.selectSignal(
    isGoogleLoginSelector
  );

  @Output() updatedTodoEvent = new EventEmitter<TodoModel>();
  @Output() removeTodoEvent = new EventEmitter<string>();

  private updateTodo$(
    request: Partial<UpdateTodoRequestModel>
  ): Observable<UpdateTodoResponseModel> {
    return this._todoService
      .updateTodo$(request)
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  private deleteTodo$(id: string): Observable<{ id: string }> {
    return this._todoService
      .deleteTodo$(id)
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  completeTodo(): void {
    const request: Partial<UpdateTodoRequestModel> = {
      id: this.todoSignal()?.id,
      isCompleted: !this.todoSignal().isCompleted,
    };

    this.updateTodo$(request)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((response) => {
        this.updatedTodoEvent.emit(response?.todo);
      });
  }

  removeTodo(): void {
    this.deleteTodo$(this.todoSignal().id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((response) => {
        this.removeTodoEvent.emit(response.id);
      });
  }

  pinTodo(): void {
    const request: Partial<UpdateTodoRequestModel> = {
      id: this.todoSignal().id,
      isPinned: !this.todoSignal().isPinned,
    };

    this.updateTodo$(request)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((response) => {
        this.updatedTodoEvent.emit(response?.todo);
      });
  }

  editTodo(): void {
    import('../todo-modal/todo-modal.component').then((c) => {
      const dialog = this._dialog.open(c.TodoModalComponent, {
        data: {
          todo: this.todoSignal() ?? null,
        },
      });

      dialog
        .afterClosed()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((result: TodoModel) => {
          if (result) {
            this.updatedTodoEvent.emit(result);
          }
        });
    });
  }

  createGoogleEvent(): void {
    const event = {
      summary: this.todoSignal().title,
      start: {
        date: this.todoSignal().dueDate,
        timeZone: 'Europe/Paris',
      },
      end: {
        date: this.todoSignal().dueDate,
        timeZone: 'Europe/Paris',
      },
    };

    const googleAuthToken = this._cookieService.get(
      SessionStorageEnum.GOOGLE_ACCESS_TOKEN
    );

    if (googleAuthToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${googleAuthToken}`,
        'Content-Type': 'application/json',
        skip: 'true',
      });

      this._httpClient
        .post(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          event,
          { headers }
        )
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response) => {
            console.log('Event created:', response);
          },
          error: (error) => {
            console.error('Error creating event:', error);
          },
        });
    }
  }
}
