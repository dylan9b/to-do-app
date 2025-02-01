export interface TodoModel {
  id: string;
  title: string;
  isCompleted: false;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  priorityId: string;
  userId: string;
}
