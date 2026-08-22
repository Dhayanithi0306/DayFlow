import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService, LoginParams, SignupParams } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginParams) => Promise<User>;
  signup: (data: SignupParams) => Promise<{ user: User; verificationToken?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('dayflow_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('dayflow_token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.getCurrentUser();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setToken(storedToken);
      } else {
        localStorage.removeItem('dayflow_token');
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.warn('Session hydration failed:', err);
      localStorage.removeItem('dayflow_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginParams): Promise<User> => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await authService.login(credentials);
      if (res.success && res.data) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('dayflow_token', newToken);
        setToken(newToken);
        setUser(userData);
        return userData;
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupParams): Promise<{ user: User; verificationToken?: string }> => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await authService.signup(data);
      if (res.success && res.data) {
        return res.data;
      } else {
        throw new Error(res.message || 'Signup failed');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('dayflow_token');
    setUser(null);
    setToken(null);
    setError(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res.success) {
        // Refresh user details to update mustChangePassword flag
        await refreshUser();
      } else {
        throw new Error(res.message || 'Change password failed');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Change password failed.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        changePassword,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
