export interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profilePicture: string | null;
  department: string;
  designation: string;
  joiningDate: string;
  employmentType: string;
  reportingManager: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  salary: {
    basic: number;
    allowances: number;
    deductions: number;
    gross: number;
    net: number;
    currency: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'Verified' | 'Pending' | 'Rejected';
  }>;
}

export const MOCK_EMPLOYEE_PROFILE: EmployeeProfile = {
  id: 'EMP001',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'employee@dayflow.com',
  phone: '+1 (555) 123-4567',
  address: '123 Innovation Drive, Tech Park, CA 94105',
  profilePicture: null,
  department: 'Engineering',
  designation: 'Senior Frontend Engineer',
  joiningDate: 'Jan 15, 2024',
  employmentType: 'Full-time',
  reportingManager: 'Alex Morgan',
  status: 'Active',
  salary: {
    basic: 85000,
    allowances: 15000,
    deductions: 4500,
    gross: 100000,
    net: 95500,
    currency: 'USD'
  },
  documents: [
    {
      id: 'doc1',
      name: 'Employment Contract',
      type: 'PDF',
      uploadDate: 'Jan 10, 2024',
      status: 'Verified'
    },
    {
      id: 'doc2',
      name: 'Offer Letter',
      type: 'PDF',
      uploadDate: 'Jan 05, 2024',
      status: 'Verified'
    },
    {
      id: 'doc3',
      name: 'Identity Document',
      type: 'JPG',
      uploadDate: 'Jan 12, 2024',
      status: 'Verified'
    }
  ]
};
