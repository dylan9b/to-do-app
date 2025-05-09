import { TodoModel } from '../todo.model';
import { TodoResponseModel } from './todo-response.model';

export interface CreateTodoResponseModel extends TodoResponseModel {
  todo: TodoModel;
}
