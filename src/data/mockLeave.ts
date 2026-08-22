export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  remarks: string;
  appliedOn: string;
  status: LeaveStatus;
  adminComment?: string;
  isoStartDate: string;
}

// Initial Mock State
let mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr_1',
    type: 'Paid Leave',
    startDate: 'Aug 25, 2026',
    endDate: 'Aug 26, 2026',
    days: 2,
    remarks: 'Family vacation',
    appliedOn: 'Aug 10, 2026',
    status: 'Approved',
    adminComment: 'Enjoy your vacation!',
    isoStartDate: '2026-08-25T00:00:00.000Z'
  },
  {
    id: 'lr_2',
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
    type: 'Unpaid Leave',
    startDate: 'Jul 15, 2026',
    endDate: 'Jul 15, 2026',
    days: 1,
    remarks: 'Personal errands',
    appliedOn: 'Jul 10, 2026',
    status: 'Rejected',
    adminComment: 'Too many team members on leave this day. Please reschedule.',
    isoStartDate: '2026-07-15T00:00:00.000Z'
  }
];

export const leaveService = {
  getLeaveRequests: () => {
    return [...mockLeaveRequests].sort((a, b) => new Date(b.isoStartDate).getTime() - new Date(a.isoStartDate).getTime());
  },
  
  getLeaveBalances: () => {
    return {
      paidLeave: { used: 8, remaining: 12, total: 20 },
      sickLeave: { used: 3, remaining: 7, total: 10 },
      unpaidLeave: { used: 1, remaining: 0, total: 0 } // Unpaid doesn't really have a limit in this mock
    };
  },

  getLeaveSummary: () => {
    return {
      available: 12 + 7, // Paid + Sick remaining
      pending: mockLeaveRequests.filter(r => r.status === 'Pending').length,
      approved: mockLeaveRequests.filter(r => r.status === 'Approved').length,
      rejected: mockLeaveRequests.filter(r => r.status === 'Rejected').length
    };
  },

  createLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status' | 'isoStartDate'>) => {
    const newRequest: LeaveRequest = {
      ...data,
      id: `lr_${Date.now()}`,
      appliedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending',
      isoStartDate: new Date(data.startDate).toISOString()
    };
    mockLeaveRequests = [newRequest, ...mockLeaveRequests];
    return newRequest;
  }
};
