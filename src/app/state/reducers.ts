import { createReducer, on } from '@ngrx/store';
import { STATUS } from '../status.constants';
import { todosAdapter } from './adapter';
import { TodoState } from './state';
import { TodosActions } from './actions';

export const initialState: TodoState = todosAdapter.getInitialState({
  error: null,
  status: STATUS.PENDING,
  request: null,
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
  })),

  // UPDATE TODO
  on(TodosActions.update, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(TodosActions.updateSuccess, (state, { response }) => ({
    ...state,
    ...todosAdapter.updateOne(response, state),
    status: STATUS.SUCCESS,
  })),
  on(TodosActions.updateFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  })),

  // DELETE TODO
  on(TodosActions.delete, (state) => ({
    ...state,
    status: STATUS.LOADING,
  })),
  on(TodosActions.deleteSuccess, (state, { id }) => ({
    ...state,
    ...todosAdapter.removeOne(id, state),
    status: STATUS.SUCCESS,
  })),
  on(TodosActions.deleteFailure, (state, { error }) => ({
    ...state,
    status: STATUS.ERROR,
    error,
  }))
);
