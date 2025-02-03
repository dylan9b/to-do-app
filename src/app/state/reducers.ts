import { createReducer, on } from '@ngrx/store';
import { STATUS } from '../status.constants';
import { todosAdapter } from './adapter';
import { TodoState } from './state';
import { TodosActions } from './actions';

export const initialState: TodoState = todosAdapter.getInitialState({
  error: null,
  status: STATUS.PENDING,
  request: null
});

export const todoReducer = createReducer(
  initialState,

  //GET TODOS
  on(TodosActions.load, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(TodosActions.loadSuccess, (state, { response }) => {
    const todos = todosAdapter.setMany(response, state);
    const updatedState = {
      ...state,
      ...todos,
      status: STATUS.SUCCESS,
    };

    return updatedState;
  }),
  on(TodosActions.loadFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  }))
);
