export interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  joiningDate: string;
  departmentId: string;
  designation: string;
  managerId?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  role?: 'EMPLOYEE' | 'ADMIN';
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  joiningDate?: string;
  departmentId?: string;
  designation?: string;
  managerId?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  employmentStatus?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

export interface SelfProfileUpdateInput {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  profilePictureUrl?: string;
}

export const validateCreateEmployee = (input: CreateEmployeeInput) => {
  if (!input.firstName || !input.firstName.trim()) {
    return { isValid: false, message: 'First name is required.' };
  }
  if (!input.lastName || !input.lastName.trim()) {
    return { isValid: false, message: 'Last name is required.' };
  }
  if (!input.email || !input.email.trim()) {
    return { isValid: false, message: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email.trim())) {
    return { isValid: false, message: 'Invalid email address format.' };
  }
  if (!input.joiningDate) {
    return { isValid: false, message: 'Joining date is required.' };
  }
  if (!input.departmentId) {
    return { isValid: false, message: 'Department is required.' };
  }
  if (!input.designation || !input.designation.trim()) {
    return { isValid: false, message: 'Designation is required.' };
  }

  return { isValid: true };
};

export const validateSelfProfileUpdate = (input: SelfProfileUpdateInput) => {
  // Disallow extraneous restricted fields if attempted
  const allowedKeys = ['phone', 'address', 'city', 'state', 'postalCode', 'country', 'profilePictureUrl'];
  const inputKeys = Object.keys(input);

  for (const key of inputKeys) {
    if (!allowedKeys.includes(key)) {
      return { isValid: false, message: `Field "${key}" cannot be updated by employee.` };
    }
  }

  return { isValid: true };
};
