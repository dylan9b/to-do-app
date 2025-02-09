export interface TodoResponseModel {
  success: boolean;
  message: string;
  id: string;

  kind?: string;
  htmlLink?: string;
}
