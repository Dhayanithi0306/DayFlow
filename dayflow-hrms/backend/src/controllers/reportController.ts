import { Response, NextFunction } from 'express';
import { ReportService } from '../services/reportService.js';
import { ExportService } from '../services/exportService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getEmployeeReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const data = await ReportService.getEmployeeReport(req.user.sub, req.user.companyId, req.query as any);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const data = await ReportService.getAttendanceReport(req.user.sub, req.user.companyId, req.query as any);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getLeaveReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const data = await ReportService.getLeaveReport(req.user.sub, req.user.companyId, req.query as any);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPayrollReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const data = await ReportService.getPayrollReport(req.user.sub, req.user.companyId, req.query as any);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// CSV Export Controllers
export const exportEmployeeReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const csv = await ExportService.exportEmployeesCsv(req.user.sub, req.user.companyId, req.query as any);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=Employee_Report.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportAttendanceReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const csv = await ExportService.exportAttendanceCsv(req.user.sub, req.user.companyId, req.query as any);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=Attendance_Report.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportLeaveReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const csv = await ExportService.exportLeaveCsv(req.user.sub, req.user.companyId, req.query as any);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=Leave_Report.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportPayrollReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const csv = await ExportService.exportPayrollCsv(req.user.sub, req.user.companyId, req.query as any);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=Payroll_Report.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
