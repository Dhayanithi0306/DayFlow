import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getUserNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await NotificationService.getUserNotifications(req.user.sub, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await NotificationService.getUnreadCount(req.user.sub);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const notification = await NotificationService.markAsRead(req.user.sub, id);
    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await NotificationService.markAllAsRead(req.user.sub);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
