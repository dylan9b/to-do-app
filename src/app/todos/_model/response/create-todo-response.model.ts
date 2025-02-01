import { TodoModel } from '../todo.model';

export interface CreateTodoResponseModel {
  message: string;
  success: boolean;
  todo: TodoModel;
}
