import React, { createContext, useContext, useState } from 'react';
import type { Role } from '../types/hrms';

export type AuthView =
  | 'login'
  | 'signup'
  | 'first-login'
  | 'verify-email'
  | 'forgot-password'
  | 'reset-password';

interface NewlyCreatedUser {
  loginId: string;
  email: string;
  name: string;
  tempPassword: string;
  role: Role;
}

interface AuthContextType {
  authView: AuthView;
  setAuthView: (view: AuthView) => void;
  registeredEmail: string;
  setRegisteredEmail: (email: string) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  lastCreatedUser: NewlyCreatedUser | null;
  generateSystemLoginId: (name: string, year?: number) => string;
  registerNewUser: (companyName: string, companyLogo: string | null, name: string, email: string, phone: string, pass: string, role: Role) => void;
  completeFirstLogin: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const generateSystemLoginId = (name: string, year = 2026): string => {
  const parts = name.trim().split(' ');
  let initials = 'XX';
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2).toUpperCase();
  }
  const randomSerial = Math.floor(1000 + Math.random() * 9000);
  return `DAY${initials}${year}${randomSerial}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [registeredEmail, setRegisteredEmail] = useState<string>('sarah@dayflow.com');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [lastCreatedUser, setLastCreatedUser] = useState<NewlyCreatedUser | null>(null);

  const registerNewUser = (
    _companyName: string,
    _companyLogo: string | null,
    name: string,
    email: string,
    _phone: string,
    pass: string,
    role: Role
  ) => {
    const generatedId = generateSystemLoginId(name);
    const created: NewlyCreatedUser = {
      loginId: generatedId,
      email,
      name,
      tempPassword: pass || 'DAYFLOW2026!',
      role,
    };
    setLastCreatedUser(created);
    setRegisteredEmail(email);
    setAuthView('verify-email');
  };

  const completeFirstLogin = (_newPassword: string) => {
    setAuthView('login');
  };

  return (
    <AuthContext.Provider
      value={{
        authView,
        setAuthView,
        registeredEmail,
        setRegisteredEmail,
        rememberMe,
        setRememberMe,
        lastCreatedUser,
        generateSystemLoginId,
        registerNewUser,
        completeFirstLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
