import {
  ChangeDetectionStrategy,
  Component,
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

  readonly todoSignal = input.required<TodoModel>();

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
    import('./../todo-create-modal/todo-create-modal.component').then((c) => {
      this._dialog.open(c.TodoCreateModalComponent, {
        data: {
          todo: this.todoSignal() ?? null,
        },
      });
    });
  }
}
