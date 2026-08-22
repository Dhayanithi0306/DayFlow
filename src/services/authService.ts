import type { User } from '../types/auth';

const MOCK_USERS: Record<string, User> = {
  'employee@dayflow.com': {
    id: 'emp_001',
    name: 'Sarah Jenkins',
    email: 'employee@dayflow.com',
    role: 'employee',
  },
  'hr@dayflow.com': {
    id: 'hr_001',
    name: 'Alex Morgan',
    email: 'hr@dayflow.com',
    role: 'hr',
  },
  'admin@dayflow.com': {
    id: 'adm_001',
    name: 'System Admin',
    email: 'admin@dayflow.com',
    role: 'admin',
  }
};

const MOCK_PASSWORDS: Record<string, string> = {
  'employee@dayflow.com': 'Employee@123',
  'hr@dayflow.com': 'HR@123',
  'admin@dayflow.com': 'Admin@123',
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (email: string, password: string): Promise<User> => {
  await delay(800); // Simulate network request

  const user = MOCK_USERS[email];
  const correctPassword = MOCK_PASSWORDS[email];

  if (!user || password !== correctPassword) {
    throw new Error('Invalid email or password');
  }

  return user;
};

export const mockSignup = async (_data: any): Promise<void> => {
  await delay(1000);
  // Just simulate success
};

export const mockVerifyEmail = async (code: string): Promise<void> => {
  await delay(800);
  if (code !== '123456') {
    throw new Error('Invalid verification code');
  }
};

export const mockSendResetLink = async (_email: string): Promise<void> => {
  await delay(800);
  // Always succeed in mock
};

export const mockResetPassword = async (_password: string): Promise<void> => {
  await delay(800);
};
