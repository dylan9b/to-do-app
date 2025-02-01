export interface CreateTodoRequestModel {
  title: string;
  isCompleted: boolean;
  dueDate: Date;
  priorityId: string;
}
