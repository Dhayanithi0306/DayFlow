import { api } from './api';
import { ApiResponse, EmployeeDashboardData, AdminDashboardData, AuditLog } from '../types';

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
}

export interface AuditLogListResponse {
  items: AuditLog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const dashboardService = {
  getEmployeeDashboard: async (): Promise<ApiResponse<{ dashboard: EmployeeDashboardData }>> => {
    const response = await api.get<ApiResponse<{ dashboard: EmployeeDashboardData }>>('/dashboard/employee');
    return response.data;
  },

  getAdminDashboard: async (): Promise<ApiResponse<{ dashboard: AdminDashboardData }>> => {
    const response = await api.get<ApiResponse<{ dashboard: AdminDashboardData }>>('/dashboard/admin');
    return response.data;
  },

  getAuditLogs: async (params?: AuditLogQueryParams): Promise<ApiResponse<AuditLogListResponse>> => {
    const response = await api.get<ApiResponse<AuditLogListResponse>>('/audit-logs', { params });
    return response.data;
  },
};
