import { createSelector } from '@ngrx/store';
import { todosAdapter } from './todo-adapter';
import { AppState } from '../app.state';

export const selectTodoState = (state: AppState) => state?.todos;

const { selectAll, selectTotal } = todosAdapter.getSelectors();

export const selectAllTodos = createSelector(selectTodoState, selectAll);
export const selectTodosTotal = createSelector(selectTodoState, selectTotal);

export const selectAllCompletedTotal = createSelector(
  selectAllTodos,
  (todos) => todos?.filter((todo) => todo?.isCompleted).length
);

export const selectSearchTerm = createSelector(
  selectTodoState,
  (state) => state.request?.searchTerm ?? null
);

export const selectColumnSort = createSelector(
  selectTodoState,
  (state) => state.request?.orderColumn ?? null
);

export const selectColumnSortDirection = createSelector(
  selectTodoState,
  (state) => state.request?.orderDirection ?? null
);
