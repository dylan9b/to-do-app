import { PriorityState } from './priority/priority.state';
import { TodoState } from './todo/todo-state';

export interface AppState {
  todos: TodoState;
  priorities: PriorityState;
}
