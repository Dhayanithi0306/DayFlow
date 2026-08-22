import { api } from './api';
import { ApiResponse, Employee, Attendance, LeaveRequest, PayrollRecord } from '../types';

export interface GlobalSearchResults {
  employees: Employee[];
  attendance: Attendance[];
  leave: LeaveRequest[];
  payroll: PayrollRecord[];
}

export const searchService = {
  globalSearch: async (query: string): Promise<ApiResponse<{ results: GlobalSearchResults }>> => {
    const response = await api.get<ApiResponse<{ results: GlobalSearchResults }>>('/search', {
      params: { q: query },
    });
    return response.data;
  },
};
