import { adminService } from './mockAdmin';

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
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  payPeriod: string;
  paymentDate: string;
  status: PaymentStatus;
  breakdown: SalaryBreakdown;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  isoDate: string;
}

// Generate historical mock data across all employees
const generateGlobalMockHistory = (): PayrollRecord[] => {
  const history: PayrollRecord[] = [];
  const employees = adminService.getEmployees();
  
  const months = ['August', 'July', 'June', 'May', 'April', 'March'];
  
  employees.forEach(emp => {
    // Determine a base salary loosely based on department/role
    let basic = 40000;
    if (emp.department === 'Engineering') basic = 60000;
    else if (emp.department === 'Design') basic = 45000;
    else if (emp.department === 'Marketing') basic = 35000;
    
    // Adjust slightly for this specific employee to make data look real
    const hash = emp.name.charCodeAt(0) * 1000;
    basic = basic + hash;

    const hra = Math.round(basic * 0.2);
    const allowances = 5000;
    const tax = Math.round(basic * 0.1);
    const otherDeductions = 1000;

    months.forEach((month, index) => {
      // Slightly vary the bonus
      const currentBonus = index === 0 ? 2000 : index % 2 === 0 ? 1500 : 2500;
      const gross = basic + hra + allowances + currentBonus;
      const deds = tax + otherDeductions;
      const net = gross - deds;

      let status: PaymentStatus = 'Paid';
      if (index === 0) {
        status = 'Pending'; // Mock logic: current month is pending
      }

      history.push({
        id: `pr_${emp.id}_2026_${month.toLowerCase()}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        payPeriod: `${month} 2026`,
        paymentDate: `25 ${month.substring(0, 3)} 2026`,
        status,
        breakdown: {
          basic,
          hra,
          allowances,
          bonus: currentBonus,
          tax,
          otherDeductions
        },
        grossSalary: gross,
        totalDeductions: deds,
        netSalary: net,
        isoDate: `2026-${String(8 - index).padStart(2, '0')}-01T00:00:00.000Z`
      });
    });
  });

  return history;
};

// Mutable singleton state
export let globalPayrollRecords = generateGlobalMockHistory();

export const payrollService = {
  // --- EMPLOYEE METHODS ---
  getMyPayroll: () => {
    // Return the latest payroll record for EMP001
    const myHistory = payrollService.getPayrollHistory('EMP001');
    return { ...myHistory[0] };
  },
  
  getPayrollHistory: (employeeId = 'EMP001') => {
    return globalPayrollRecords
      .filter(r => r.employeeId === employeeId)
      .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
  },
  
  getPayrollById: (id: string) => {
    return globalPayrollRecords.find(pr => pr.id === id) || null;
  },

  // --- ADMIN METHODS ---
  getAllPayrollRecords: (payPeriod?: string) => {
    let records = [...globalPayrollRecords];
    if (payPeriod) {
      records = records.filter(r => r.payPeriod === payPeriod);
    }
    return records.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
  },

  getPayrollSummary: (payPeriod: string) => {
    const records = globalPayrollRecords.filter(r => r.payPeriod === payPeriod);
    const totalEmployees = records.length;
    const totalGross = records.reduce((sum, r) => sum + r.grossSalary, 0);
    const totalDeductions = records.reduce((sum, r) => sum + r.totalDeductions, 0);
    const totalNet = records.reduce((sum, r) => sum + r.netSalary, 0);
    
    return {
      totalEmployees,
      totalGross,
      totalDeductions,
      totalNet
    };
  },

  updatePayroll: (id: string, breakdown: SalaryBreakdown, status?: PaymentStatus) => {
    const idx = globalPayrollRecords.findIndex(r => r.id === id);
    if (idx !== -1) {
      const gross = breakdown.basic + breakdown.hra + breakdown.allowances + breakdown.bonus;
      const deds = breakdown.tax + breakdown.otherDeductions;
      const net = gross - deds;

      globalPayrollRecords[idx] = {
        ...globalPayrollRecords[idx],
        breakdown,
        grossSalary: gross,
        totalDeductions: deds,
        netSalary: net,
        status: status || globalPayrollRecords[idx].status
      };
      
      // Update the reference so React state recognizes the change if spread
      globalPayrollRecords = [...globalPayrollRecords];
    }
  }
};
