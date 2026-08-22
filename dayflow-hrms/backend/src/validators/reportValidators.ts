export interface ReportQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  employeeId?: string;
  status?: string;
  leaveType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const ALLOWED_EMPLOYEE_SORTS = ['firstName', 'lastName', 'joiningDate', 'employmentStatus', 'employeeId'];
const ALLOWED_ATTENDANCE_SORTS = ['date', 'status', 'workingMinutes', 'createdAt'];
const ALLOWED_LEAVE_SORTS = ['createdAt', 'startDate', 'endDate', 'status', 'duration'];
const ALLOWED_PAYROLL_SORTS = ['payPeriodStart', 'payPeriodEnd', 'grossSalary', 'netSalary', 'generatedAt'];

export const validateReportQuery = (reportType: 'employees' | 'attendance' | 'leave' | 'payroll', params: ReportQueryParams) => {
  if (params.startDate && isNaN(Date.parse(params.startDate))) {
    return { isValid: false, message: 'Valid start date is required.' };
  }
  if (params.endDate && isNaN(Date.parse(params.endDate))) {
    return { isValid: false, message: 'Valid end date is required.' };
  }

  if (params.startDate && params.endDate) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    if (end.getTime() < start.getTime()) {
      return { isValid: false, message: 'End date cannot be before start date.' };
    }
  }

  let allowedSorts: string[] = [];
  if (reportType === 'employees') allowedSorts = ALLOWED_EMPLOYEE_SORTS;
  else if (reportType === 'attendance') allowedSorts = ALLOWED_ATTENDANCE_SORTS;
  else if (reportType === 'leave') allowedSorts = ALLOWED_LEAVE_SORTS;
  else if (reportType === 'payroll') allowedSorts = ALLOWED_PAYROLL_SORTS;

  if (params.sortBy && !allowedSorts.includes(params.sortBy)) {
    return { isValid: false, message: `Invalid sort field. Allowed fields: ${allowedSorts.join(', ')}` };
  }

  return { isValid: true };
};
