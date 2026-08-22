import type { User } from '../../types/auth';

const mockEmployees: User[] = [
  { id: '1', employeeId: 'EMP-001', name: 'Admin User', email: 'admin@dayflow.com', role: 'admin', department: 'Management', designation: 'HR Manager' },
  { id: '2', employeeId: 'EMP-002', name: 'HR User', email: 'hr@dayflow.com', role: 'hr', department: 'Human Resources', designation: 'HR Executive' },
  { id: '3', employeeId: 'EMP-003', name: 'John Doe', email: 'john.doe@dayflow.com', role: 'employee', department: 'Engineering', designation: 'Software Engineer' },
  { id: '4', employeeId: 'EMP-004', name: 'Jane Smith', email: 'jane.smith@dayflow.com', role: 'employee', department: 'Marketing', designation: 'Marketing Specialist' },
  { id: '5', employeeId: 'EMP-005', name: 'Mike Johnson', email: 'mike.j@dayflow.com', role: 'employee', department: 'Engineering', designation: 'QA Engineer' },
];

export const getEmployees = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockEmployees), 500);
  });
};

export const getEmployeeById = async (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockEmployees.find(e => e.id === id || e.employeeId === id)), 300);
  });
};
