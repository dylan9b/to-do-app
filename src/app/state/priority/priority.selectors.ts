import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { priorityAdapter } from './priority.adapter';

export const selectPriorityState = (state: AppState) => state?.priorities;

const { selectAll } = priorityAdapter.getSelectors();

export const selectAllPriorities = createSelector(
  selectPriorityState,
  selectAll
);
