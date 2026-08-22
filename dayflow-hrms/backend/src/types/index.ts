export type UserRole = 'EMPLOYEE' | 'ADMIN';

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface HealthStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface DatabaseStatusResponse {
  success: boolean;
  database: string;
  details?: string;
}
