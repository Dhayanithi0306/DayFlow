import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('dayflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!currentUser;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dayflow_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dayflow_user');
    }
  }, [currentUser]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout }}>
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
