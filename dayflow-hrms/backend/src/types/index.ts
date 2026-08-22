import { Request } from 'express';

export type UserRole = 'EMPLOYEE' | 'ADMIN';
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type DocumentType = 'RESUME' | 'IDENTITY' | 'EDUCATION' | 'CERTIFICATE' | 'OTHER';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserPayload {
  sub: string;
  id?: string;
  companyId: string;
  email?: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthUserSummary {
  id: string;
  companyId: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: Date | null;
  employee?: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    designation: string;
    profilePictureUrl?: string | null;
  } | null;
}

export interface AuthLoginResponse {
  token: string;
  user: AuthUserSummary;
}

export interface HealthStatusResponse {
  success: boolean;
  message: string;
}

export interface DatabaseStatusResponse {
  success: boolean;
  database: string;
  message?: string;
  error?: string;
}
