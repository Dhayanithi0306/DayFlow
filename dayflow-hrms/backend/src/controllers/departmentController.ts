import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export const listDepartments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }

    const departments = await prisma.department.findMany({
      where: { companyId: req.user.companyId },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { departments },
    });
  } catch (error) {
    next(error);
  }
};
