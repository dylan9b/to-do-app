import { createSelector } from '@ngrx/store';
import { AppState } from '@state/app.state';

export const selectUserState = (state: AppState) => state?.user;

export const isGoogleLoginSelector = createSelector(
  selectUserState,
  (state) => state.isGoogleLogin
);
