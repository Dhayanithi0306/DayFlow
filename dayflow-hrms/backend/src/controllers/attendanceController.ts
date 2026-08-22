import { Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendanceService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const checkIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const record = await AttendanceService.checkIn(req.user.sub);
    res.status(200).json({
      success: true,
      message: 'Clock-in successful. Have a productive workday!',
      data: { attendance: record },
    });
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const record = await AttendanceService.checkOut(req.user.sub);
    res.status(200).json({
      success: true,
      message: 'Clock-out successful. Workday completed!',
      data: { attendance: record },
    });
  } catch (error) {
    next(error);
  }
};

export const getTodayAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const record = await AttendanceService.getTodayAttendance(req.user.sub);
    res.status(200).json({
      success: true,
      data: { attendance: record },
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await AttendanceService.getEmployeeAttendance(req.user.sub, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const timeframe = (req.query.timeframe as 'week' | 'month') || 'month';
    const summary = await AttendanceService.getEmployeeSummary(req.user.sub, timeframe);
    res.status(200).json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await AttendanceService.listAdminAttendance(req.user.companyId, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const summary = await AttendanceService.getAdminSummary(req.user.companyId);
    res.status(200).json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const updated = await AttendanceService.updateAttendance(req.user.sub, req.user.companyId, id, req.body);
    res.status(200).json({
      success: true,
      message: 'Attendance record updated successfully.',
      data: { attendance: updated },
    });
  } catch (error) {
    next(error);
  }
};
