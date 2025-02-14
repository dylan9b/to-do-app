export interface UpdateTodoRequestModel {
  id: string;
  priorityId: string;
  userId?: string;
  title: string;
  isCompleted: boolean;
  isPinned: boolean;
  order: number;
  dueDate: string;
}