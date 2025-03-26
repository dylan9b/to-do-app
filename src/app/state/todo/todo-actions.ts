import { createActionGroup, props } from '@ngrx/store';
import { TodoRequestModel } from '../../todos/_model/request/todo-request.model';
import { TodoModel } from '../../todos/_model/todo.model';
import { UpdateTodoRequestModel } from '../../todos/_model/request/update-todo-request.model';
import { Update } from '@ngrx/entity';
import { CreateTodoRequestModel } from '../../todos/_model/request/create-todo-request.model';

export const todosActions = createActionGroup({
  source: 'Todos',
  events: {
    Load: props<{ request: Partial<TodoRequestModel> | null }>(),
    'Load Success': props<{ response: TodoModel[] }>(),
    'Load Failure': props<{ error: string }>(),

    Update: props<{ request: Partial<UpdateTodoRequestModel> }>(),
    'Update Success': props<{ response: Update<TodoModel> }>(),
    'Update Failure': props<{ error: string }>(),

    Delete: props<{ id: string }>(),
    'Delete Success': props<{ id: string }>(),
    'Delete Failure': props<{ error: string }>(),

    Create: props<{ request: CreateTodoRequestModel }>(),
    'Create Success': props<{ response: TodoModel }>(),
    'Create Failure': props<{ error: string }>(),

    // Keep track of the filters applied so that on opening the modal, the filters are pre-populated
    UpdateFilters: props<{ request: Partial<TodoRequestModel> | null }>(),
  },
});
