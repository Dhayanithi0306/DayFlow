import { Response, NextFunction } from 'express';
import { PayrollService } from '../services/payrollService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getEmployeeSalary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const data = await PayrollService.getEmployeeSalary(req.user.sub);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeePayrollHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await PayrollService.getEmployeePayrollHistory(req.user.sub, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminPayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await PayrollService.listAdminPayroll(req.user.companyId, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPayrollSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const summary = await PayrollService.getAdminPayrollSummary(req.user.companyId);
    res.status(200).json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminEmployeeSalary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const employeeId = req.params.employeeId as string;
    const data = await PayrollService.getAdminEmployeeSalary(req.user.companyId, employeeId);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeSalary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const employeeId = req.params.employeeId as string;
    const updated = await PayrollService.updateEmployeeSalary(req.user.sub, req.user.companyId, employeeId, req.body);
    res.status(200).json({
      success: true,
      message: 'Employee salary structure updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const generatePayrollRecords = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await PayrollService.generatePayrollRecords(req.user.sub, req.user.companyId, req.body);
    res.status(201).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
