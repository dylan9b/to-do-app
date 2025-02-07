import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { userActions } from './user-actions';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { AuthService } from '@services/auth.service';

@Injectable()
export class UserEffects {
  private readonly _actions$ = inject(Actions);
  private readonly _authService = inject(AuthService);

  isLoggedOut$ = createEffect(() =>
    this._actions$.pipe(
      ofType(userActions.logout),
      switchMap(() =>
        from(this._authService.logoutFromGoogle$()).pipe(
          map((isLoggedOut) => userActions.logoutSuccess({ isLoggedOut })),
          catchError((error) => of(userActions.logoutFailure({ error })))
        )
      )
    )
  );
}
