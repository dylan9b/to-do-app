import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '@services/todo.service';
import { TodosActions } from './actions';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { Update } from '@ngrx/entity';
import { TodoModel } from '../todos/_model/todo.model';

@Injectable()
export class TodoEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _todoService = inject(TodoService);

  loadTodos$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TodosActions.load),
      switchMap((action) =>
        from(this._todoService.todos$(action?.request)).pipe(
          map((response) => TodosActions.loadSuccess({ response })),
          catchError((error) => of(TodosActions.loadFailure({ error })))
        )
      )
    )
  );

  updateTodo$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TodosActions.update),
      switchMap((action) =>
        from(this._todoService.updateTodo$(action?.request)).pipe(
          map((response) => {
            const updatedTodo: Update<TodoModel> = {
              id: response?.todo?.id,
              changes: { ...response?.todo },
            };

            return TodosActions.updateSuccess({ response: updatedTodo });
          }),
          catchError((error) => of(TodosActions.updateFailure({ error })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TodosActions.delete),
      switchMap((action) =>
        from(this._todoService.deleteTodo$(action?.id)).pipe(
          map((response) => {
            return TodosActions.deleteSuccess({ id: response.id });
          }),
          catchError((error) => of(TodosActions.deleteFailure({ error })))
        )
      )
    )
  );
}
