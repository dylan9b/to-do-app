import { TodoRequestModel } from '../../todos/_model/request/todo-request.model';
import { TodoModel } from '../../todos/_model/todo.model';
import { EntityState } from '@ngrx/entity';

export interface TodoState extends EntityState<TodoModel> {
  error: string | null;
  status: string;
  request:  TodoRequestModel | null;
}
