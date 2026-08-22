export type UserRole = 'EMPLOYEE' | 'ADMIN';
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type DocumentType = 'RESUME' | 'IDENTITY' | 'EDUCATION' | 'CERTIFICATE' | 'OTHER';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
export type LeaveType = 'PAID' | 'SICK' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  companyId: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string;
  employee?: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    designation: string;
    profilePictureUrl?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  userId: string;
  companyId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePictureUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  designation: string;
  departmentId: string;
  managerId?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  workingMinutes?: number | null;
  extraMinutes?: number | null;
  status: AttendanceStatus;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    profilePictureUrl?: string | null;
    department?: {
      id: string;
      name: string;
    } | null;
  } | null;
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
