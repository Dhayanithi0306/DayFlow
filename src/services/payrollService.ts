import type { Payroll, PayrollSummary } from '../types/payroll';

// Temporary mock data for Payroll until API is available
const mockPayrollData: Payroll[] = [
  {
    id: 'PR-001',
    employeeId: 'EMP-003',
    employeeName: 'John Doe',
    department: 'Engineering',
    designation: 'Software Engineer',
    month: 'October',
    year: 2023,
    structure: {
      basicSalary: 60000,
      hra: 24000,
      allowances: 10000,
      bonus: 5000,
      deductions: 2000,
      tax: 8000,
    },
    grossSalary: 99000,
    netSalary: 89000,
    status: 'Paid',
    paymentDate: '2023-10-31',
    createdAt: '2023-10-25',
    updatedAt: '2023-10-31',
  },
  {
    id: 'PR-002',
    employeeId: 'EMP-004',
    employeeName: 'Jane Smith',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    month: 'October',
    year: 2023,
    structure: {
      basicSalary: 50000,
      hra: 20000,
      allowances: 8000,
      bonus: 2000,
      deductions: 1500,
      tax: 6000,
    },
    grossSalary: 80000,
    netSalary: 72500,
    status: 'Pending',
    createdAt: '2023-10-25',
    updatedAt: '2023-10-25',
  },
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPayrollRecords = async (month?: string, year?: number, employeeId?: string): Promise<Payroll[]> => {
  await delay(500);
  let records = [...mockPayrollData];
  
  if (month) records = records.filter(p => p.month === month);
  if (year) records = records.filter(p => p.year === year);
  if (employeeId) records = records.filter(p => p.employeeId === employeeId);
  
  return records;
};

export const getPayrollById = async (id: string): Promise<Payroll | undefined> => {
  await delay(300);
  return mockPayrollData.find(p => p.id === id);
};

export const updatePayroll = async (id: string, updates: Partial<Payroll>): Promise<Payroll> => {
  await delay(600);
  const index = mockPayrollData.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Payroll record not found');
  
  const updatedRecord = { ...mockPayrollData[index], ...updates, updatedAt: new Date().toISOString() };
  
  // Recalculate if structure changed
  if (updates.structure) {
    const { basicSalary, hra, allowances, bonus, deductions, tax } = updatedRecord.structure;
    updatedRecord.grossSalary = basicSalary + hra + allowances + bonus;
    updatedRecord.netSalary = updatedRecord.grossSalary - deductions - tax;
  }
  
  mockPayrollData[index] = updatedRecord;
  return updatedRecord;
};

export const getPayrollSummary = async (month: string, year: number): Promise<PayrollSummary> => {
  await delay(400);
  const records = mockPayrollData.filter(p => p.month === month && p.year === year);
  
  return records.reduce((acc, curr) => ({
    totalPayroll: acc.totalPayroll + curr.grossSalary, // or net depending on company def
    totalGrossSalary: acc.totalGrossSalary + curr.grossSalary,
    totalDeductions: acc.totalDeductions + curr.structure.deductions + curr.structure.tax,
    totalNetSalary: acc.totalNetSalary + curr.netSalary,
    totalEmployeesPaid: acc.totalEmployeesPaid + (curr.status === 'Paid' ? 1 : 0),
  }), {
    totalPayroll: 0,
    totalGrossSalary: 0,
    totalDeductions: 0,
    totalNetSalary: 0,
    totalEmployeesPaid: 0,
  });
};
