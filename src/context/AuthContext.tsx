import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Role } from '../types/auth';

interface AuthContextType {
  user: User | null;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Role, User> = {
  admin: {
    id: '1',
    employeeId: 'EMP-001',
    name: 'Admin User',
    email: 'admin@dayflow.com',
    role: 'admin',
    department: 'Management',
    designation: 'HR Manager',
  },
  hr: {
    id: '2',
    employeeId: 'EMP-002',
    name: 'HR User',
    email: 'hr@dayflow.com',
    role: 'hr',
    department: 'Human Resources',
    designation: 'HR Executive',
  },
  employee: {
    id: '3',
    employeeId: 'EMP-003',
    name: 'John Doe',
    email: 'john.doe@dayflow.com',
    role: 'employee',
    department: 'Engineering',
    designation: 'Software Engineer',
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUsers.admin);

  const switchRole = (role: Role) => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
