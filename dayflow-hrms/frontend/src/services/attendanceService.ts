import { api } from './api';
import { ApiResponse, Attendance, AttendanceStatus } from '../types';

export interface AttendanceQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  employeeId?: string;
  departmentId?: string;
}

export interface AttendanceListResponse {
  items: Attendance[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AttendanceSummaryData {
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  leaveCount: number;
  totalWorkingMinutes: number;
  totalExtraMinutes: number;
  totalEmployees?: number;
  recordsCount?: number;
}

export interface AdminUpdateAttendanceParams {
  checkIn?: string;
  checkOut?: string;
  status?: AttendanceStatus;
  remarks?: string;
}

export const attendanceService = {
  // Self Service
  checkIn: async (): Promise<ApiResponse<{ attendance: Attendance }>> => {
    const response = await api.post<ApiResponse<{ attendance: Attendance }>>('/attendance/check-in');
    return response.data;
  },

  checkOut: async (): Promise<ApiResponse<{ attendance: Attendance }>> => {
    const response = await api.post<ApiResponse<{ attendance: Attendance }>>('/attendance/check-out');
    return response.data;
  },

  getTodayAttendance: async (): Promise<ApiResponse<{ attendance: Attendance | null }>> => {
    const response = await api.get<ApiResponse<{ attendance: Attendance | null }>>('/attendance/me/today');
    return response.data;
  },

  getEmployeeAttendance: async (params?: AttendanceQueryParams): Promise<ApiResponse<AttendanceListResponse>> => {
    const response = await api.get<ApiResponse<AttendanceListResponse>>('/attendance/me', { params });
    return response.data;
  },

  getEmployeeSummary: async (timeframe: 'week' | 'month' = 'month'): Promise<ApiResponse<{ summary: AttendanceSummaryData }>> => {
    const response = await api.get<ApiResponse<{ summary: AttendanceSummaryData }>>('/attendance/me/summary', {
      params: { timeframe },
    });
    return response.data;
  },

  // Admin Management
  listAdminAttendance: async (params?: AttendanceQueryParams): Promise<ApiResponse<AttendanceListResponse>> => {
    const response = await api.get<ApiResponse<AttendanceListResponse>>('/attendance', { params });
    return response.data;
  },

  getAdminSummary: async (): Promise<ApiResponse<{ summary: AttendanceSummaryData }>> => {
    const response = await api.get<ApiResponse<{ summary: AttendanceSummaryData }>>('/attendance/admin/summary');
    return response.data;
  },

  updateAttendance: async (id: string, data: AdminUpdateAttendanceParams): Promise<ApiResponse<{ attendance: Attendance }>> => {
    const response = await api.patch<ApiResponse<{ attendance: Attendance }>>(`/attendance/${id}`, data);
    return response.data;
  },
};
