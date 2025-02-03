import { createActionGroup, props } from '@ngrx/store';
import { TodoRequestModel } from '../todos/_model/request/todo-request.model';
import { TodoModel } from '../todos/_model/todo.model';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    Load: props<{ request: TodoRequestModel | null }>(),
    'Load Success': props<{ response: TodoModel[] }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
