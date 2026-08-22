import axios from 'axios';
import { ApiHealthResponse, DbHealthResponse, HealthCheckResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dayflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const healthService = {
  checkApiHealth: async (): Promise<ApiHealthResponse> => {
    const response = await api.get<ApiHealthResponse>('/health');
    return response.data;
  },

  checkDbHealth: async (): Promise<DbHealthResponse> => {
    const response = await api.get<DbHealthResponse>('/health/db');
    return response.data;
  },

  verifyFullConnection: async (): Promise<HealthCheckResult> => {
    const result: HealthCheckResult = {
      frontend: true,
      backend: false,
      database: false,
    };

    try {
      const apiRes = await healthService.checkApiHealth();
      result.backend = apiRes.success;
      result.backendMessage = apiRes.message;

      try {
        const dbRes = await healthService.checkDbHealth();
        result.database = dbRes.success && dbRes.database === 'connected';
        result.databaseMessage = dbRes.message || `Database is ${dbRes.database}`;
      } catch (dbError) {
        result.database = false;
        result.databaseMessage = dbError instanceof Error ? dbError.message : 'Database connection error';
      }
    } catch (apiError) {
      result.backend = false;
      result.backendMessage = apiError instanceof Error ? apiError.message : 'Backend server offline';
      result.database = false;
      result.databaseMessage = 'Unable to check database (Backend offline)';
    }

    return result;
  },
};
