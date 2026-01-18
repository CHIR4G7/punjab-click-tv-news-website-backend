export interface User {
  id: string;
  name: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseApiResponse {
  success: boolean;
  message: string;
}

export interface ApiSuccessResponse<T> extends BaseApiResponse {
  success: true;
  data: T;
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  errors?: string[] | any[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Specific response types for verify endpoints
export interface CreateAdminResponseData {
  id: string;
  name: string;
  username: string;
  createdAt: Date;
}

export interface LoginAdminResponseData {
  user: User;
}

// Export the specific response types
export type CreateAdminResponse = ApiResponse<CreateAdminResponseData>;
export type LoginAdminResponse = ApiResponse<LoginAdminResponseData>;