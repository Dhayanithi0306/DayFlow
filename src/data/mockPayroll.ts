export type PaymentStatus = 'Paid' | 'Processing' | 'Pending';

export interface SalaryBreakdown {
  basic: number;
  hra: number;
  allowances: number;
  bonus: number;
  tax: number;
  otherDeductions: number;
}

export interface PayrollRecord {
  id: string;
  payPeriod: string;
  paymentDate: string;
  status: PaymentStatus;
  breakdown: SalaryBreakdown;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  isoDate: string;
}

// Generate historical mock data
const generateMockHistory = (): PayrollRecord[] => {
  const history: PayrollRecord[] = [];
  const baseSalary = {
    basic: 40000,
    hra: 8000,
    allowances: 5000,
    bonus: 2000,
    tax: 4000,
    otherDeductions: 1000
  };

  const months = ['August', 'July', 'June', 'May', 'April', 'March'];
  
  months.forEach((month, index) => {
    // Slightly vary the bonus for older months to make data look real
    const currentBonus = index === 0 ? 2000 : index % 2 === 0 ? 1500 : 2500;
    const gross = baseSalary.basic + baseSalary.hra + baseSalary.allowances + currentBonus;
    const deds = baseSalary.tax + baseSalary.otherDeductions;
    const net = gross - deds;

    let status: PaymentStatus = 'Paid';
    if (index === 0 && new Date().getDate() < 25) {
      status = 'Processing'; // Mock logic: current month might be processing
    }

    history.push({
      id: `pr_2026_${month.toLowerCase()}`,
      payPeriod: `${month} 2026`,
      paymentDate: `25 ${month.substring(0, 3)} 2026`,
      status,
      breakdown: {
        ...baseSalary,
        bonus: currentBonus
      },
      grossSalary: gross,
      totalDeductions: deds,
      netSalary: net,
      isoDate: `2026-${String(8 - index).padStart(2, '0')}-01T00:00:00.000Z`
    });
  });

  return history;
};

export const mockPayrollHistory = generateMockHistory();

export const payrollService = {
  getMyPayroll: () => {
    // Return the latest payroll record
    return { ...mockPayrollHistory[0] };
  },
  
  getPayrollHistory: () => {
    return [...mockPayrollHistory].sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
  },
  
  getPayrollById: (id: string) => {
    return mockPayrollHistory.find(pr => pr.id === id) || null;
  }
};
