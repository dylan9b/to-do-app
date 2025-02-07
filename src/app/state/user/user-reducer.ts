import { createReducer, on } from '@ngrx/store';
import { STATUS } from '../../status.constants';
import { userActions } from './user-actions';
import { UserState } from './user-state';

export const initialState: UserState = {
  isLoggedOut: null,
  status: STATUS.PENDING,
  loggedInThroughGoogle: null,
};

export const userReducer = createReducer(
  initialState,

  // USER LOGOUT FROM GOOGLE
  on(userActions.logout, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(userActions.logoutSuccess, (state, { isLoggedOut }) => ({
    ...state,
    isLoggedOut,
    status: STATUS.SUCCESS,
  })),
  on(userActions.logoutFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  })),
);
