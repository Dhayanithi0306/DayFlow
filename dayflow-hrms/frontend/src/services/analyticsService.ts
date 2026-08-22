import { api } from './api';
import { ApiResponse } from '../types';

export interface AdminAnalyticsData {
  employeeStats: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    onLeaveEmployees: number;
  };
  attendanceTrend: {
    date: string;
    present: number;
    absent: number;
    halfDay: number;
    leave: number;
  }[];
  departmentAttendance: {
    departmentName: string;
    present: number;
    absent: number;
    leave: number;
  }[];
  leaveStats: {
    pendingLeave: number;
    approvedLeave: number;
    rejectedLeave: number;
    leaveTypeDistribution: { leaveType: string; count: number }[];
  };
  payrollStats: {
    totalEmployees: number;
    employeesWithSalary: number;
    totalGrossPayroll: string;
    totalDeductions: string;
    totalNetPayroll: string;
  };
  departmentPayroll: {
    departmentName: string;
    grossPayroll: string;
    netPayroll: string;
  }[];
}

export const analyticsService = {
  getAdminAnalytics: async (): Promise<ApiResponse<{ analytics: AdminAnalyticsData }>> => {
    const response = await api.get<ApiResponse<{ analytics: AdminAnalyticsData }>>('/analytics/admin');
    return response.data;
  },
};
