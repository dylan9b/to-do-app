import { TodoModel } from '../todo.model';

export interface TodoResponseModel {
  success: boolean;
  todo: TodoModel;
}
