import { api } from './api';
import { User, ApiResponse } from '../types';

export interface LoginParams {
  email: string;
  password: string;
}

export interface SignupParams {
  employeeId: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupResponse {
  user: User;
  verificationToken?: string;
}

export const authService = {
  login: async (credentials: LoginParams): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  },

  signup: async (data: SignupParams): Promise<ApiResponse<SignupResponse>> => {
    const response = await api.post<ApiResponse<SignupResponse>>('/auth/signup', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/verify-email', { token });
    return response.data;
  },

  resendVerification: async (email: string): Promise<ApiResponse<{ verificationToken?: string }>> => {
    const response = await api.post<ApiResponse<{ verificationToken?: string }>>('/auth/resend-verification', { email });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<{ resetToken?: string }>> => {
    const response = await api.post<ApiResponse<{ resetToken?: string }>>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};
