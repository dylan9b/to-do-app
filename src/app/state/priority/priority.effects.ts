import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PriorityService } from '@services/priority.service';
import { switchMap, from, map, catchError, of } from 'rxjs';
import { priorityActions } from './priority.actions';

@Injectable()
export class PriorityEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _priorityService = inject(PriorityService);

  loadPriorities$ = createEffect(() =>
    this._actions$.pipe(
      ofType(priorityActions.load),
      switchMap(() =>
        from(this._priorityService.priorities$()).pipe(
          map((response) => priorityActions.loadSuccess({ response })),
          catchError((error) => of(priorityActions.loadFailure({ error })))
        )
      )
    )
  );
}
