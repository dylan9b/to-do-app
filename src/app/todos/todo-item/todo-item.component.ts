import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { TodoModel } from '../_model/todo.model';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UpdateTodoRequestModel } from '../_model/request/update-todo-request.model';
import { todosActions } from '../../state/todo/todo-actions';
import { DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isGoogleLoginSelector } from '@state/user/user-selector';

@Component({
  selector: 'app-todo-item',
  imports: [MatCheckboxModule, MatIconModule, DatePipe, MatMenuModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  private readonly _store = inject(Store<AppState>);
  private readonly _dialog = inject(MatDialog);
  private readonly _cookieService = inject(CookieService);
  private readonly _httpClient = inject(HttpClient);
  private readonly _destroyRef = inject(DestroyRef);
  readonly todoSignal = input.required<TodoModel>();

  readonly isGoogleLoginSignal = this._store.selectSignal(
    isGoogleLoginSelector
  );

  onTaskToggle(event: MatCheckboxChange): void {
    const request: Partial<UpdateTodoRequestModel> = {
      id: this.todoSignal()?.id,
      isCompleted: event?.checked,
    };

    this._store.dispatch(
      todosActions.update({
        request,
      })
    );
  }

  removeTodo(): void {
    this._store.dispatch(todosActions.delete({ id: this.todoSignal().id }));
  }

  editTodo(): void {
    import('../todo-modal/todo-modal.component').then((c) => {
      this._dialog.open(c.TodoModalComponent, {
        data: {
          todo: this.todoSignal() ?? null,
        },
      });
    });
  }

  createEvent(): void {
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
