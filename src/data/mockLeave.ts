export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  remarks: string;
  appliedOn: string;
  status: LeaveStatus;
  adminComment?: string;
  isoStartDate: string;
  decisionDate?: string;
  decisionBy?: string;
}

// Initial Mock State
let mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr_1',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    type: 'Paid Leave',
    startDate: 'Aug 25, 2026',
    endDate: 'Aug 26, 2026',
    days: 2,
    remarks: 'Family vacation',
    appliedOn: 'Aug 10, 2026',
    status: 'Approved',
    adminComment: 'Enjoy your vacation!',
    isoStartDate: '2026-08-25T00:00:00.000Z',
    decisionDate: 'Aug 11, 2026',
    decisionBy: 'Admin'
  },
  {
    id: 'lr_2',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    type: 'Sick Leave',
    startDate: 'Aug 22, 2026',
    endDate: 'Aug 22, 2026',
    days: 1,
    remarks: 'Not feeling well, visiting doctor',
    appliedOn: 'Aug 22, 2026',
    status: 'Pending',
    isoStartDate: '2026-08-22T00:00:00.000Z'
  },
  {
    id: 'lr_3',
    employeeId: 'EMP001',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    type: 'Unpaid Leave',
    startDate: 'Jul 15, 2026',
    endDate: 'Jul 15, 2026',
    days: 1,
    remarks: 'Personal errands',
    appliedOn: 'Jul 10, 2026',
    status: 'Rejected',
    adminComment: 'Too many team members on leave this day. Please reschedule.',
    isoStartDate: '2026-07-15T00:00:00.000Z',
    decisionDate: 'Jul 11, 2026',
    decisionBy: 'HR Officer'
  },
  // Add some for other employees
  {
    id: 'lr_102',
    employeeId: 'EMP012',
    employeeName: 'Maria Garcia',
    department: 'Design',
    type: 'Paid Leave',
    startDate: 'Sep 01, 2026',
    endDate: 'Sep 05, 2026',
    days: 5,
    remarks: 'Going out of town',
    appliedOn: 'Aug 21, 2026',
    status: 'Pending',
    isoStartDate: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'lr_103',
    employeeId: 'EMP045',
    employeeName: 'James Wilson',
    department: 'Marketing',
    type: 'Sick Leave',
    startDate: 'Aug 28, 2026',
    endDate: 'Aug 28, 2026',
    days: 1,
    remarks: 'Dental appointment',
    appliedOn: 'Aug 20, 2026',
    status: 'Pending',
    isoStartDate: '2026-08-28T00:00:00.000Z'
  }
];

export const leaveService = {
  // Employee methods
  getLeaveRequests: () => {
    // By default, for the employee side, we filter only their requests
    return [...mockLeaveRequests]
      .filter(r => r.employeeId === 'EMP001' || !r.employeeId)
      .sort((a, b) => new Date(b.isoStartDate).getTime() - new Date(a.isoStartDate).getTime());
  },
  
  getLeaveBalances: () => {
    return {
      paidLeave: { used: 8, remaining: 12, total: 20 },
      sickLeave: { used: 3, remaining: 7, total: 10 },
      unpaidLeave: { used: 1, remaining: 0, total: 0 }
    };
  },

  getLeaveSummary: () => {
    const myRequests = leaveService.getLeaveRequests();
    return {
      available: 12 + 7, // Paid + Sick remaining
      pending: myRequests.filter(r => r.status === 'Pending').length,
      approved: myRequests.filter(r => r.status === 'Approved').length,
      rejected: myRequests.filter(r => r.status === 'Rejected').length
    };
  },

  createLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status' | 'isoStartDate'>) => {
    const newRequest: LeaveRequest = {
      ...data,
      id: `lr_${Date.now()}`,
      employeeId: 'EMP001',
      employeeName: 'Sarah Jenkins',
      department: 'Engineering',
      appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
      isoStartDate: new Date(data.startDate).toISOString()
    };
    mockLeaveRequests = [newRequest, ...mockLeaveRequests];
    return newRequest;
  },

  // Admin methods
  getAllLeaveRequests: () => {
    return [...mockLeaveRequests].sort((a, b) => new Date(b.isoStartDate).getTime() - new Date(a.isoStartDate).getTime());
  },

  getAdminSummary: () => {
    return {
      total: mockLeaveRequests.length,
      pending: mockLeaveRequests.filter(r => r.status === 'Pending').length,
      approved: mockLeaveRequests.filter(r => r.status === 'Approved').length,
      rejected: mockLeaveRequests.filter(r => r.status === 'Rejected').length
    };
  },

  approveLeaveRequest: (id: string, decisionBy: string) => {
    const idx = mockLeaveRequests.findIndex(r => r.id === id);
    if (idx !== -1) {
      mockLeaveRequests[idx] = {
        ...mockLeaveRequests[idx],
        status: 'Approved',
        decisionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        decisionBy
      };
    }
  },

  rejectLeaveRequest: (id: string, comment: string, decisionBy: string) => {
    const idx = mockLeaveRequests.findIndex(r => r.id === id);
    if (idx !== -1) {
      mockLeaveRequests[idx] = {
        ...mockLeaveRequests[idx],
        status: 'Rejected',
        adminComment: comment,
        decisionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        decisionBy
      };
    }
  }
};
