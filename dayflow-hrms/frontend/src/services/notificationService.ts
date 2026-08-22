import { api } from './api';
import { ApiResponse, Notification } from '../types';

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface NotificationListResponse {
  items: Notification[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount: number;
}

export const notificationService = {
  getUserNotifications: async (params?: NotificationQueryParams): Promise<ApiResponse<NotificationListResponse>> => {
    const response = await api.get<ApiResponse<NotificationListResponse>>('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<{ unreadCount: number }>> => {
    const response = await api.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<{ notification: Notification }>> => {
    const response = await api.patch<ApiResponse<{ notification: Notification }>>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse> => {
    const response = await api.patch<ApiResponse>('/notifications/read-all');
    return response.data;
  },
};
