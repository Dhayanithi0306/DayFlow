import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/auth';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 1. Loading state

  // Initialize auth state
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dayflow_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.email && parsed.role) {
          setCurrentUser(parsed as User); // 2. Authenticated state
        } else {
          setCurrentUser(null); // 3. Unauthenticated state
        }
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!currentUser;

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('dayflow_user', JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem('dayflow_user');
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading Dayflow...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, isLoading, login, logout }}>
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
