export interface TodoModel {
  id: string;
  title: string;
  isCompleted: boolean;
  isPinned: boolean;
  order: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  priorityId: string;
  userId: string;
}
