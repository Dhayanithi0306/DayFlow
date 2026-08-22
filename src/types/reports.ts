export interface AttendanceReport {
  totalEmployees: number;
  present: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  attendancePercentage: number;
  date: string;
}

export interface LeaveReport {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  leaveTypeDistribution: Record<string, number>;
  month: string;
  year: number;
}

export interface EmployeeReport {
  totalEmployees: number;
  byDepartment: Record<string, number>;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
}
