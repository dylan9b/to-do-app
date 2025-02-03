export interface TodoRequestModel {
  userId: string;
  searchTerm: string;
  priorityId: string;
  isCompleted: boolean;
}