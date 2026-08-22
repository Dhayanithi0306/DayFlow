import { NotificationType } from '@prisma/client';
import { prisma } from '../config/db.js';

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export class NotificationService {
  /**
   * Create a single database notification record for a user
   */
  static async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    linkUrl?: string
  ) {
    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        linkUrl: linkUrl || null,
        isRead: false,
      },
    });
  }

  /**
   * Bulk create notifications for multiple users (e.g. all Admins)
   */
  static async createBulkNotifications(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    linkUrl?: string
  ) {
    if (userIds.length === 0) return;
    const records = userIds.map((userId) => ({
      userId,
      type,
      title,
      message,
      linkUrl: linkUrl || null,
      isRead: false,
    }));

    return prisma.notification.createMany({
      data: records,
    });
  }

  /**
   * Get user notifications (Paginated, newest first)
   */
  static async getUserNotifications(userId: string, params: NotificationQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = { userId };
    if (params.unreadOnly) {
      whereClause.isRead = false;
    }

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages, unreadCount };
  }

  /**
   * Get unread notification count for user
   */
  static async getUnreadCount(userId: string) {
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount };
  }

  /**
   * Mark a single notification as read
   */
  static async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw { statusCode: 404, message: 'Notification not found.' };
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { success: true, message: 'All notifications marked as read.' };
  }
}
