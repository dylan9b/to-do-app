import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PriorityModel } from './priority.model';

export const priorityActions = createActionGroup({
  source: 'Priorities',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ response: PriorityModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
