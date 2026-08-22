export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Sick' | 'Casual' | 'Annual' | 'Unpaid';
  status: 'Pending' | 'Approved' | 'Rejected';
  startDate: string;
  endDate: string;
}

const mockLeaves: LeaveRequest[] = [
  { id: '1', employeeId: 'EMP-003', type: 'Sick', status: 'Approved', startDate: '2023-10-10', endDate: '2023-10-11' },
  { id: '2', employeeId: 'EMP-004', type: 'Casual', status: 'Pending', startDate: '2023-10-15', endDate: '2023-10-16' },
  { id: '3', employeeId: 'EMP-005', type: 'Annual', status: 'Approved', startDate: '2023-10-20', endDate: '2023-10-25' },
];

export const getLeavesByMonth = async (_month: number, _year: number): Promise<LeaveRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockLeaves), 350);
  });
};
