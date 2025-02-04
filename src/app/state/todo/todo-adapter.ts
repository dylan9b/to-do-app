import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TodoModel } from '../../todos/_model/todo.model';

export const todosAdapter: EntityAdapter<TodoModel> =
  createEntityAdapter<TodoModel>({
    selectId: (todo) => todo?.id,
    sortComparer: (a, b) =>
      new Date(a?.dueDate)?.getTime() - new Date(b?.dueDate)?.getTime(),
  });
