export interface TodoRequestModel {
  userId: string | null;
  searchTerm: string | null;
  priorityId: string | null;
  isCompleted: boolean | null;
  isPinned: boolean | null;
  orderColumn: string | null;
  orderDirection: 'ASC' | 'DESC' | null;
}
