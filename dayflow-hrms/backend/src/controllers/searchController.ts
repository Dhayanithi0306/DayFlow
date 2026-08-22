import { Response, NextFunction } from 'express';
import { SearchService } from '../services/searchService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const globalSearch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId || !req.user.role) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const q = (req.query.q as string) || '';
    const results = await SearchService.globalSearch(req.user.sub, req.user.role, req.user.companyId, q);
    res.status(200).json({
      success: true,
      data: { results },
    });
  } catch (error) {
    next(error);
  }
};
