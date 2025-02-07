import { PriorityState } from './priority/priority.state';
import { TodoState } from './todo/todo-state';
import { UserState } from './user/user-state';

export interface AppState {
  todos: TodoState;
  priorities: PriorityState;
  user: UserState;
}
