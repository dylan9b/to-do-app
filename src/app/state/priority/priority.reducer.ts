import { createReducer, on } from '@ngrx/store';
import { STATUS } from '../../status.constants';
import { priorityActions } from './priority.actions';
import { priorityAdapter } from './priority.adapter';
import { PriorityState } from './priority.state';

export const initialState: PriorityState = priorityAdapter.getInitialState({
  error: null,
  status: STATUS.PENDING,
  request: null,
});

export const priorityReducer = createReducer(
  initialState,

  //GET PRIORITIES
  on(priorityActions.load, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(priorityActions.loadSuccess, (state, { response }) => ({
    ...state,
    ...priorityAdapter.setMany(response, state),
    status: STATUS.SUCCESS,
  })),
  on(priorityActions.loadFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  }))
);
