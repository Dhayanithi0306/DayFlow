import { api } from './api';
import { ApiResponse, Employee, Attendance, LeaveRequest, PayrollRecord } from '../types';

export interface ReportQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  employeeId?: string;
  status?: string;
  leaveType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReportListResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const reportService = {
  getEmployeeReport: async (params?: ReportQueryParams): Promise<ApiResponse<ReportListResponse<Employee>>> => {
    const response = await api.get<ApiResponse<ReportListResponse<Employee>>>('/reports/employees', { params });
    return response.data;
  },

  getAttendanceReport: async (params?: ReportQueryParams): Promise<ApiResponse<ReportListResponse<Attendance>>> => {
    const response = await api.get<ApiResponse<ReportListResponse<Attendance>>>('/reports/attendance', { params });
    return response.data;
  },

  getLeaveReport: async (params?: ReportQueryParams): Promise<ApiResponse<ReportListResponse<LeaveRequest>>> => {
    const response = await api.get<ApiResponse<ReportListResponse<LeaveRequest>>>('/reports/leave', { params });
    return response.data;
  },

  getPayrollReport: async (params?: ReportQueryParams): Promise<ApiResponse<ReportListResponse<PayrollRecord>>> => {
    const response = await api.get<ApiResponse<ReportListResponse<PayrollRecord>>>('/reports/payroll', { params });
    return response.data;
  },

  // Export CSV functions
  exportEmployeeReport: async (params?: ReportQueryParams): Promise<Blob> => {
    const response = await api.get('/reports/employees/export', { params, responseType: 'blob' });
    return response.data;
  },

  exportAttendanceReport: async (params?: ReportQueryParams): Promise<Blob> => {
    const response = await api.get('/reports/attendance/export', { params, responseType: 'blob' });
    return response.data;
  },

  exportLeaveReport: async (params?: ReportQueryParams): Promise<Blob> => {
    const response = await api.get('/reports/leave/export', { params, responseType: 'blob' });
    return response.data;
  },

  exportPayrollReport: async (params?: ReportQueryParams): Promise<Blob> => {
    const response = await api.get('/reports/payroll/export', { params, responseType: 'blob' });
    return response.data;
  },
};
