export interface UpdateTodoRequestModel {
  id: string;
  priorityId: string;
  userId?: string;
  title: string;
  isCompleted: boolean;
  dueDate: string;
}