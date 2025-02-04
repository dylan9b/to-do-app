import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '@services/todo.service';
import { todosActions } from './todo-actions';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { Update } from '@ngrx/entity';
import { TodoModel } from '../../todos/_model/todo.model';

@Injectable()
export class TodoEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _todoService = inject(TodoService);

  loadTodos$ = createEffect(() =>
    this._actions$.pipe(
      ofType(todosActions.load),
      switchMap((action) =>
        from(this._todoService.todos$(action?.request)).pipe(
          map((response) => todosActions.loadSuccess({ response })),
          catchError((error) => of(todosActions.loadFailure({ error })))
        )
      )
    )
  );

  updateTodo$ = createEffect(() =>
    this._actions$.pipe(
      ofType(todosActions.update),
      switchMap((action) =>
        from(this._todoService.updateTodo$(action?.request)).pipe(
          map((response) => {
            const updatedTodo: Update<TodoModel> = {
              id: response?.todo?.id,
              changes: { ...response?.todo },
            };

            return todosActions.updateSuccess({ response: updatedTodo });
          }),
          catchError((error) => of(todosActions.updateFailure({ error })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this._actions$.pipe(
      ofType(todosActions.delete),
      switchMap((action) =>
        from(this._todoService.deleteTodo$(action?.id)).pipe(
          map((response) => {
            return todosActions.deleteSuccess({ id: response.id });
          }),
          catchError((error) => of(todosActions.deleteFailure({ error })))
        )
      )
    )
  );

  createTodo$ = createEffect(() =>
    this._actions$.pipe(
      ofType(todosActions.create),
      switchMap((action) =>
        from(this._todoService.createTodo$(action?.request)).pipe(
          map((response) => {
            return todosActions.createSuccess({ response: response?.todo });
          }),
          catchError((error) => of(todosActions.createFailure({ error })))
        )
      )
    )
  );
}
