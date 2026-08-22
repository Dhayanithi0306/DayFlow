import type { AttendanceReport, EmployeeReport, LeaveReport } from '../types/reports';
import { getAttendanceByMonth } from './mock/attendanceService';
import { getLeavesByMonth } from './mock/leaveService';
import { getEmployees } from './mock/employeeService';



export const getAttendanceReport = async (month: number, year: number): Promise<AttendanceReport> => {
  // In a real app, this would be a single API call to the backend.
  // Here, we simulate fetching attendance records and aggregating them.
  const attendanceRecords = await getAttendanceByMonth(month, year);
  const totalEmployees = 50; // Mock total
  
  const present = attendanceRecords.filter(r => r.status === 'Present').length;
  const absent = attendanceRecords.filter(r => r.status === 'Absent').length;
  const halfDay = attendanceRecords.filter(r => r.status === 'Half-day').length;
  const onLeave = attendanceRecords.filter(r => r.status === 'Leave').length;
  
  // A simplistic percentage calculation for the mock data
  const attendancePercentage = totalEmployees > 0 ? ((present + (halfDay * 0.5)) / totalEmployees) * 100 : 0;
  
  return {
    totalEmployees,
    present: present || 42, // Mocking larger numbers for the chart
    absent: absent || 3,
    halfDay: halfDay || 2,
    onLeave: onLeave || 3,
    attendancePercentage: attendancePercentage || 87,
    date: `${year}-${month.toString().padStart(2, '0')}-01`,
  };
};

export const getLeaveReport = async (month: number, year: number): Promise<LeaveReport> => {
  const leaveRequests = await getLeavesByMonth(month, year);
  
  return {
    totalRequests: leaveRequests.length || 15,
    pending: leaveRequests.filter(l => l.status === 'Pending').length || 4,
    approved: leaveRequests.filter(l => l.status === 'Approved').length || 9,
    rejected: leaveRequests.filter(l => l.status === 'Rejected').length || 2,
    leaveTypeDistribution: {
      Sick: 5,
      Casual: 6,
      Annual: 3,
      Unpaid: 1,
    },
    month: month.toString(),
    year,
  };
};

export const getEmployeeReport = async (): Promise<EmployeeReport> => {
  const employees = await getEmployees();
  
  return {
    totalEmployees: employees.length || 50,
    byDepartment: {
      Engineering: 25,
      Marketing: 10,
      'Human Resources': 5,
      Management: 10,
    },
    byRole: {
      employee: 40,
      hr: 5,
      admin: 5,
    },
    byStatus: {
      Active: 48,
      Inactive: 2,
    }
  };
};
