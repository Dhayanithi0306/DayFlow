export type UserRole = 'EMPLOYEE' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface HealthCheckResult {
  frontend: boolean;
  backend: boolean;
  database: boolean;
  backendMessage?: string;
  databaseMessage?: string;
  error?: string;
}

export interface ApiHealthResponse {
  success: boolean;
  message: string;
}

export interface DbHealthResponse {
  success: boolean;
  database: string;
  message?: string;
  error?: string;
}
