import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/db.js';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'DAYFLOW HRMS API is running',
  });
};

export const getDatabaseHealth = async (_req: Request, res: Response): Promise<void> => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (isConnected) {
      res.status(200).json({
        success: true,
        database: 'connected',
      });
    } else {
      res.status(503).json({
        success: false,
        database: 'disconnected',
        message: 'Could not establish connection to PostgreSQL database via Prisma.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown database connection error',
    });
  }
};
