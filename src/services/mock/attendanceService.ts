export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half-day' | 'Leave';
}

const mockAttendance: AttendanceRecord[] = [
  { id: '1', employeeId: 'EMP-003', date: '2023-10-01', status: 'Present' },
  { id: '2', employeeId: 'EMP-004', date: '2023-10-01', status: 'Absent' },
  { id: '3', employeeId: 'EMP-005', date: '2023-10-01', status: 'Half-day' },
  // Adding some dummy bulk data would be tedious here, so the service will just return aggregate data for reports.
];

export const getAttendanceByMonth = async (_month: number, _year: number): Promise<AttendanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAttendance), 400); // Simulate network delay
  });
};
