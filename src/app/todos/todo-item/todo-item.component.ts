import { Component, inject, input } from '@angular/core';
import { TodoModel } from '../_model/todo.model';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TodosActions } from '../../state/actions';
import { UpdateTodoRequestModel } from '../_model/request/update-todo-request.model';

@Component({
  selector: 'app-todo-item',
  imports: [MatCheckboxModule, MatIconModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
  standalone: true,
})
export class TodoItemComponent {
  private readonly _store = inject(Store<AppState>);

  todoSignal = input.required<TodoModel>();

  onTaskToggle(event: MatCheckboxChange): void {
    const request: Partial<UpdateTodoRequestModel> = {
      id: this.todoSignal()?.id,
      isCompleted: event?.checked,
    };

    this._store.dispatch(
      TodosActions.update({
        request,
      })
    );
  }

  removeTodo(): void {
    this._store.dispatch(TodosActions.delete({ id: this.todoSignal()?.id }));
  }
}
