import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAdminAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const analytics = await AnalyticsService.getAdminAnalytics(req.user.companyId);
    res.status(200).json({
      success: true,
      data: { analytics },
    });
  } catch (error) {
    next(error);
  }
};
