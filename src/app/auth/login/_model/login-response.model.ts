export interface LoginResponseModel {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiryDate: Date;
    maxAge: number;
  }
}