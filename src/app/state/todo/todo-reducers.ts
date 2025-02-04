import { createReducer, on } from '@ngrx/store';
import { STATUS } from '../../status.constants';
import { todosAdapter } from './todo-adapter';
import { TodoState } from './todo-state';
import { todosActions } from './todo-actions';

export const initialState: TodoState = todosAdapter.getInitialState({
  error: null,
  status: STATUS.PENDING,
  request: null,
});

export const todoReducer = createReducer(
  initialState,

  //GET TODOS
  on(todosActions.load, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(todosActions.loadSuccess, (state, { response }) => ({
    ...state,
    ...todosAdapter.setMany(response, state),
    status: STATUS.SUCCESS,
  })),
  on(todosActions.loadFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  })),

  // UPDATE TODO
  on(todosActions.update, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(todosActions.updateSuccess, (state, { response }) => ({
    ...state,
    ...todosAdapter.updateOne(response, state),
    status: STATUS.SUCCESS,
  })),
  on(todosActions.updateFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  })),

  // DELETE TODO
  on(todosActions.delete, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(todosActions.deleteSuccess, (state, { id }) => ({
    ...state,
    ...todosAdapter.removeOne(id, state),
    status: STATUS.SUCCESS,
  })),
  on(todosActions.deleteFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  })),

  // CREATE TODO
  on(todosActions.create, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(todosActions.createSuccess, (state, { response }) => ({
    ...state,
    ...todosAdapter.addOne(response, state),
    status: STATUS.SUCCESS,
  })),
  on(todosActions.createFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  }))
);
