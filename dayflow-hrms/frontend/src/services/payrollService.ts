import { api } from './api';
import { ApiResponse, PayrollRecord, SalaryStructure, ComputedSalaryTotals, Employee } from '../types';

export interface PayrollQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  employeeId?: string;
}

export interface PayrollListResponse {
  items: PayrollRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PayrollSummaryData {
  totalEmployees: number;
  employeesWithSalary: number;
  totalGrossPayroll: string;
  totalDeductions: string;
  totalNetPayroll: string;
}

export interface UpdateSalaryParams {
  basicSalary: number;
  hra?: number;
  standardAllowance?: number;
  performanceBonus?: number;
  leaveTravelAllowance?: number;
  fixedAllowance?: number;
  providentFund?: number;
  professionalTax?: number;
  currency?: string;
  effectiveFrom: string;
}

export interface GeneratePayrollParams {
  payPeriodStart: string;
  payPeriodEnd: string;
}

export const payrollService = {
  // Self Service (Read-Only)
  getEmployeeSalary: async (): Promise<ApiResponse<{ configured: boolean; structure?: SalaryStructure; computed?: ComputedSalaryTotals }>> => {
    const response = await api.get<ApiResponse<{ configured: boolean; structure?: SalaryStructure; computed?: ComputedSalaryTotals }>>('/payroll/me/salary');
    return response.data;
  },

  getEmployeePayrollHistory: async (params?: PayrollQueryParams): Promise<ApiResponse<PayrollListResponse>> => {
    const response = await api.get<ApiResponse<PayrollListResponse>>('/payroll/me', { params });
    return response.data;
  },

  // Admin Management
  listAdminPayroll: async (params?: PayrollQueryParams): Promise<ApiResponse<PayrollListResponse>> => {
    const response = await api.get<ApiResponse<PayrollListResponse>>('/payroll', { params });
    return response.data;
  },

  getAdminPayrollSummary: async (): Promise<ApiResponse<{ summary: PayrollSummaryData }>> => {
    const response = await api.get<ApiResponse<{ summary: PayrollSummaryData }>>('/payroll/admin/summary');
    return response.data;
  },

  getAdminEmployeeSalary: async (employeeId: string): Promise<ApiResponse<{ configured: boolean; employee?: Employee; structure?: SalaryStructure; computed?: ComputedSalaryTotals }>> => {
    const response = await api.get<ApiResponse<{ configured: boolean; employee?: Employee; structure?: SalaryStructure; computed?: ComputedSalaryTotals }>>(`/payroll/employees/${employeeId}/salary`);
    return response.data;
  },

  updateEmployeeSalary: async (employeeId: string, data: UpdateSalaryParams): Promise<ApiResponse<{ structure: SalaryStructure; computed: ComputedSalaryTotals }>> => {
    const response = await api.patch<ApiResponse<{ structure: SalaryStructure; computed: ComputedSalaryTotals }>>(`/payroll/employees/${employeeId}/salary`, data);
    return response.data;
  },

  generatePayrollRecords: async (data: GeneratePayrollParams): Promise<ApiResponse<{ generatedCount: number; skippedCount: number; message: string }>> => {
    const response = await api.post<ApiResponse<{ generatedCount: number; skippedCount: number; message: string }>>('/payroll/generate', data);
    return response.data;
  },
};
