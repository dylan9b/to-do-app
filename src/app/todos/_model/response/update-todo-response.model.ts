import { TodoModel } from '../todo.model';
import { TodoResponseModel } from './todo-response.model';

export interface UpdateTodoResponseModel extends TodoResponseModel {
  todo: TodoModel;
}
