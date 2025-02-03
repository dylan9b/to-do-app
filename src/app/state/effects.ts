import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '@services/todo.service';
import { TodosActions } from './actions';
import { catchError, from, map, of, switchMap } from 'rxjs';

@Injectable()
export class TodoEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _todoService = inject(TodoService);

  loadTodos$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TodosActions.load),
      switchMap((action) => {
        return from(this._todoService.todos$(action?.request)).pipe(
          map((response) => {
            return TodosActions.loadSuccess({ response });
          }),
          catchError((error) => of(TodosActions.loadFailure({ error })))
        );
      })
    )
  );
}
