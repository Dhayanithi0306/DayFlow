export interface AdminKPIs {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingRequests: number;
}

export interface EmployeeOverview {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  attendance: string;
  leaveStatus: string;
  employmentStatus: string;
  avatar: string | null;
  // Summary for drawer
  summary: {
    attendance: { present: number; absent: number; halfDay: number; leave: number; };
    leave: { pending: number; approved: number; rejected: number; };
    payroll: { gross: number; deductions: number; net: number; };
  };
}

export interface RecentActivity {
  id: string;
  type: 'leave' | 'attendance' | 'payroll' | 'system';
  message: string;
  time: string;
}

export interface PendingLeave {
  id: string;
  employee: string;
  type: string;
  dateRange: string;
  days: number;
  appliedDate: string;
  status: string;
}

const mockKPIs: AdminKPIs = {
  totalEmployees: 128,
  presentToday: 112,
  onLeave: 9,
  pendingRequests: 7
};

const mockEmployees: EmployeeOverview[] = [
  {
    id: 'EMP001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@dayflow.com',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    attendance: 'Present',
    leaveStatus: 'No Leave',
    employmentStatus: 'Active',
    avatar: null,
    summary: {
      attendance: { present: 20, absent: 1, halfDay: 0, leave: 1 },
      leave: { pending: 0, approved: 1, rejected: 0 },
      payroll: { gross: 100000, deductions: 4500, net: 95500 }
    }
  },
  {
    id: 'EMP002',
    name: 'Arun Kumar',
    email: 'arun.k@dayflow.com',
    department: 'Engineering',
    designation: 'Software Engineer',
    attendance: 'Present',
    leaveStatus: 'No Leave',
    employmentStatus: 'Active',
    avatar: null,
    summary: {
      attendance: { present: 21, absent: 0, halfDay: 1, leave: 0 },
      leave: { pending: 1, approved: 2, rejected: 0 },
      payroll: { gross: 80000, deductions: 3000, net: 77000 }
    }
  },
  {
    id: 'EMP012',
    name: 'Maria Garcia',
    email: 'maria.g@dayflow.com',
    department: 'Design',
    designation: 'Product Designer',
    attendance: 'Leave',
    leaveStatus: 'Sick Leave',
    employmentStatus: 'Active',
    avatar: null,
    summary: {
      attendance: { present: 18, absent: 0, halfDay: 0, leave: 4 },
      leave: { pending: 0, approved: 3, rejected: 0 },
      payroll: { gross: 75000, deductions: 2500, net: 72500 }
    }
  },
  {
    id: 'EMP045',
    name: 'James Wilson',
    email: 'james.w@dayflow.com',
    department: 'Marketing',
    designation: 'Content Strategist',
    attendance: 'Absent',
    leaveStatus: 'No Leave',
    employmentStatus: 'Active',
    avatar: null,
    summary: {
      attendance: { present: 19, absent: 3, halfDay: 0, leave: 0 },
      leave: { pending: 0, approved: 0, rejected: 1 },
      payroll: { gross: 65000, deductions: 2000, net: 63000 }
    }
  }
];

const mockPendingLeaves: PendingLeave[] = [
  {
    id: 'lr_101',
    employee: 'Arun Kumar',
    type: 'Sick Leave',
    dateRange: '25 Aug - 26 Aug',
    days: 2,
    appliedDate: '22 Aug',
    status: 'Pending'
  },
  {
    id: 'lr_102',
    employee: 'David Chen',
    type: 'Paid Leave',
    dateRange: '01 Sep - 05 Sep',
    days: 5,
    appliedDate: '21 Aug',
    status: 'Pending'
  },
  {
    id: 'lr_103',
    employee: 'Lisa Wong',
    type: 'Unpaid Leave',
    dateRange: '28 Aug - 28 Aug',
    days: 1,
    appliedDate: '20 Aug',
    status: 'Pending'
  }
];

const mockRecentActivity: RecentActivity[] = [
  { id: 'act_1', type: 'leave', message: 'Arun Kumar submitted a sick leave request.', time: '10 mins ago' },
  { id: 'act_2', type: 'attendance', message: 'Employee EMP012 checked in.', time: '2 hours ago' },
  { id: 'act_3', type: 'system', message: 'Salary structure updated for EMP004.', time: '3 hours ago' },
  { id: 'act_4', type: 'leave', message: 'Leave request approved for Sarah Jenkins.', time: '5 hours ago' },
  { id: 'act_5', type: 'system', message: 'New employee profile created (EMP129).', time: '1 day ago' }
];

export const adminService = {
  getKPIs: () => mockKPIs,
  getEmployees: () => mockEmployees,
  getPendingLeaves: () => mockPendingLeaves,
  getRecentActivity: () => mockRecentActivity,
  getAttendanceOverview: () => {
    return { present: 112, absent: 5, halfDay: 2, leave: 9 };
  }
};
