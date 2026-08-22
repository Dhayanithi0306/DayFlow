export type PayrollStatus = 'Pending' | 'Processed' | 'Paid';

export interface SalaryStructure {
  basicSalary: number;
  hra: number;
  allowances: number;
  bonus: number;
  deductions: number;
  tax: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string; // e.g., 'January'
  year: number;
  structure: SalaryStructure;
  grossSalary: number;
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollSummary {
  totalPayroll: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  totalEmployeesPaid: number;
}
