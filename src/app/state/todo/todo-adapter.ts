import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TodoModel } from '../../todos/_model/todo.model';

export const todosAdapter: EntityAdapter<TodoModel> =
  createEntityAdapter<TodoModel>({
    selectId: (todo) => todo?.id,
    // sortComparer: (a, b) => b.order - a.order,
  });
