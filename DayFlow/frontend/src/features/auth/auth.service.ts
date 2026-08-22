import type { AuthUser, LoginCredentials } from './auth.types';

// Mock Development Accounts
const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  'admin@dayflow.test': {
    id: '1',
    employeeId: 'ADM-001',
    name: 'Admin User',
    email: 'admin@dayflow.test',
    password: 'password123',
    role: 'ADMIN',
    firstLogin: false,
  },
  'hr@dayflow.test': {
    id: '2',
    employeeId: 'HR-001',
    name: 'HR Manager',
    email: 'hr@dayflow.test',
    password: 'password123',
    role: 'HR',
    firstLogin: false,
  },
  'employee@dayflow.test': {
    id: '3',
    employeeId: 'EMP-001',
    name: 'Standard Employee',
    email: 'employee@dayflow.test',
    password: 'password123',
    role: 'EMPLOYEE',
    firstLogin: true, // For testing first login flow
  },
};

const STORAGE_KEY = 'dayflow_auth_user';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_USERS[credentials.email.toLowerCase()];

    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...authUser } = user;
    
    // Store in localStorage for session persistence
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    
    return authUser;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  getCurrentUser(): AuthUser | null {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      return null;
    }
  }

  async changePassword(_newPassword: string): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    // In a real app, this sends the new password to the backend.
    // For our mock frontend, we just update the firstLogin flag.
    const updatedUser = { ...currentUser, firstLogin: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  }
}

export const authService = new AuthService();
