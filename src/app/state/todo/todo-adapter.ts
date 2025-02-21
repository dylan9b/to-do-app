import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TodoModel } from '../../todos/_model/todo.model';

export const todosAdapter: EntityAdapter<TodoModel> =
  createEntityAdapter<TodoModel>({
    selectId: (todo) => todo?.id,
    sortComparer: (a, b) =>
      a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1,
  });
