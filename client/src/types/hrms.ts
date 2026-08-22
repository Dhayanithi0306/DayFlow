export type Role = 'employee' | 'admin';

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export type LeaveType = 'Paid' | 'Sick' | 'Unpaid';

export interface UserProfile {
  id: string;
  employeeId: string; // Internal ID
  loginId: string;    // System Generated Login ID (e.g. DAYSL20260001)
  name: string;
  email: string;
  role: Role;
  avatar: string;
  designation: string;
  department: string;
  phone: string;
  joiningDate: string;
  address: string;
  companyName?: string;
  companyLogo?: string;
  manager?: string;
  location?: string;
  isFirstLogin?: boolean;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  privateInfo?: {
    dob: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
    passportNo: string;
  };
  resumeNotes?: string;
}

export interface LeaveBalance {
  paid: number;
  sick: number;
  unpaid: number;
}

export interface DetailedSalaryStructure {
  basicSalary: number;
  hra: number;                  // House Rent Allowance
  standardAllowance: number;
  performanceBonus: number;
  lta: number;                  // Leave Travel Allowance
  fixedAllowance: number;
  pfDeduction: number;          // Provident Fund
  taxDeduction: number;         // Professional Tax / Income Tax
  netSalary: number;
}

export interface EmployeeRecord extends UserProfile {
  baseSalary?: number;
  netSalary?: number;
  salaryStructure: DetailedSalaryStructure;
  bankDetails: {
    accountNo: string;
    bankName: string;
    ifsc: string;
  };
  leaveBalance: LeaveBalance;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  loginId?: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number;
  extraHours: number; // Overtime hours
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  loginId?: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  attachmentName?: string;
  adminComment?: string;
  reviewedBy?: string;
  reviewedOn?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  loginId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string;
  basicSalary: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  paymentDate?: string;
}
