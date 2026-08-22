import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = { companyId: req.user.companyId };

    if (req.query.action) whereClause.action = req.query.action;
    if (req.query.entityType) whereClause.entityType = req.query.entityType;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              email: true,
              employee: { select: { firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: { items, page, limit, total, totalPages },
    });
  } catch (error) {
    next(error);
  }
};
