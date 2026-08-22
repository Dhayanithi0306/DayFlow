import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getEmployeeDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const dashboard = await DashboardService.getEmployeeDashboard(req.user.sub);
    res.status(200).json({
      success: true,
      data: { dashboard },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const dashboard = await DashboardService.getAdminDashboard(req.user.companyId);
    res.status(200).json({
      success: true,
      data: { dashboard },
    });
  } catch (error) {
    next(error);
  }
};
