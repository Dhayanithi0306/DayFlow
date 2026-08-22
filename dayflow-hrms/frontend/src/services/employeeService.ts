import { api } from './api';
import { ApiResponse, Employee, Department, EmploymentStatus } from '../types';

export interface EmployeeQueryParams {
  search?: string;
  departmentId?: string;
  employmentStatus?: EmploymentStatus;
  page?: number;
  limit?: number;
}

export interface EmployeeListResponse {
  items: Employee[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateEmployeeParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  joiningDate: string;
  departmentId: string;
  designation: string;
  managerId?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  role?: 'EMPLOYEE' | 'ADMIN';
}

export interface UpdateEmployeeParams {
  firstName?: string;
  lastName?: string;
  phone?: string;
  joiningDate?: string;
  departmentId?: string;
  designation?: string;
  managerId?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  employmentStatus?: EmploymentStatus;
}

export interface SelfProfileUpdateParams {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  profilePictureUrl?: string;
}

export const employeeService = {
  // Self Service
  getSelfProfile: async (): Promise<ApiResponse<{ employee: Employee }>> => {
    const response = await api.get<ApiResponse<{ employee: Employee }>>('/employees/me/profile');
    return response.data;
  },

  updateSelfProfile: async (data: SelfProfileUpdateParams): Promise<ApiResponse<{ employee: Employee }>> => {
    const response = await api.patch<ApiResponse<{ employee: Employee }>>('/employees/me/profile', data);
    return response.data;
  },

  getSelfDocuments: async (): Promise<ApiResponse<{ documents: any[] }>> => {
    const response = await api.get<ApiResponse<{ documents: any[] }>>('/employees/me/documents');
    return response.data;
  },

  getSelfSalary: async (): Promise<ApiResponse<{ salaryStructures: any[] }>> => {
    const response = await api.get<ApiResponse<{ salaryStructures: any[] }>>('/employees/me/salary');
    return response.data;
  },

  // Admin Management
  listEmployees: async (params?: EmployeeQueryParams): Promise<ApiResponse<EmployeeListResponse>> => {
    const response = await api.get<ApiResponse<EmployeeListResponse>>('/employees', { params });
    return response.data;
  },

  getEmployeeById: async (id: string): Promise<ApiResponse<{ employee: Employee }>> => {
    const response = await api.get<ApiResponse<{ employee: Employee }>>(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (data: CreateEmployeeParams): Promise<ApiResponse<{ employee: Employee; tempPassword?: string }>> => {
    const response = await api.post<ApiResponse<{ employee: Employee; tempPassword?: string }>>('/employees', data);
    return response.data;
  },

  updateEmployee: async (id: string, data: UpdateEmployeeParams): Promise<ApiResponse<{ employee: Employee }>> => {
    const response = await api.patch<ApiResponse<{ employee: Employee }>>(`/employees/${id}`, data);
    return response.data;
  },

  updateEmployeeStatus: async (id: string, status: EmploymentStatus): Promise<ApiResponse<{ employee: Employee }>> => {
    const response = await api.patch<ApiResponse<{ employee: Employee }>>(`/employees/${id}/status`, { status });
    return response.data;
  },

  // Departments
  listDepartments: async (): Promise<ApiResponse<{ departments: Department[] }>> => {
    const response = await api.get<ApiResponse<{ departments: Department[] }>>('/departments');
    return response.data;
  },
};
