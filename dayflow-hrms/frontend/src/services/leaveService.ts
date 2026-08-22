import { api } from './api';
import { ApiResponse, LeaveRequest, LeaveBalance, LeaveType, LeaveStatus } from '../types';

export interface LeaveQueryParams {
  page?: number;
  limit?: number;
  status?: LeaveStatus;
  leaveType?: LeaveType;
  departmentId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export interface LeaveListResponse {
  items: LeaveRequest[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeaveSummaryData {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  todayOnLeaveCount?: number;
}

export interface CreateLeaveRequestParams {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  remarks?: string;
  attachmentUrl?: string;
}

export interface ReviewLeaveRequestParams {
  comment?: string;
}

export const leaveService = {
  // Self Service
  createLeaveRequest: async (data: CreateLeaveRequestParams): Promise<ApiResponse<{ leaveRequest: LeaveRequest }>> => {
    const response = await api.post<ApiResponse<{ leaveRequest: LeaveRequest }>>('/leave', data);
    return response.data;
  },

  getEmployeeLeaveHistory: async (params?: LeaveQueryParams): Promise<ApiResponse<LeaveListResponse>> => {
    const response = await api.get<ApiResponse<LeaveListResponse>>('/leave/me', { params });
    return response.data;
  },

  getEmployeeLeaveBalances: async (): Promise<ApiResponse<{ balances: LeaveBalance[] }>> => {
    const response = await api.get<ApiResponse<{ balances: LeaveBalance[] }>>('/leave/me/balance');
    return response.data;
  },

  // Admin Management
  listAdminLeaveRequests: async (params?: LeaveQueryParams): Promise<ApiResponse<LeaveListResponse>> => {
    const response = await api.get<ApiResponse<LeaveListResponse>>('/leave', { params });
    return response.data;
  },

  getAdminLeaveSummary: async (): Promise<ApiResponse<{ summary: LeaveSummaryData }>> => {
    const response = await api.get<ApiResponse<{ summary: LeaveSummaryData }>>('/leave/admin/summary');
    return response.data;
  },

  approveLeaveRequest: async (id: string, comment?: string): Promise<ApiResponse<{ leaveRequest: LeaveRequest }>> => {
    const response = await api.patch<ApiResponse<{ leaveRequest: LeaveRequest }>>(`/leave/${id}/approve`, { comment });
    return response.data;
  },

  rejectLeaveRequest: async (id: string, comment?: string): Promise<ApiResponse<{ leaveRequest: LeaveRequest }>> => {
    const response = await api.patch<ApiResponse<{ leaveRequest: LeaveRequest }>>(`/leave/${id}/reject`, { comment });
    return response.data;
  },
};
