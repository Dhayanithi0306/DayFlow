import { Response, NextFunction } from 'express';
import { LeaveService } from '../services/leaveService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const createLeaveRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const leaveRequest = await LeaveService.createLeaveRequest(req.user.sub, req.body);
    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully for approval.',
      data: { leaveRequest },
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeLeaveHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await LeaveService.getEmployeeLeaveHistory(req.user.sub, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeLeaveBalances = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const balances = await LeaveService.getEmployeeLeaveBalances(req.user.sub);
    res.status(200).json({
      success: true,
      data: { balances },
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminLeaveRequests = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await LeaveService.listAdminLeaveRequests(req.user.companyId, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminLeaveSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const summary = await LeaveService.getAdminLeaveSummary(req.user.companyId);
    res.status(200).json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    next(error);
  }
};

export const approveLeaveRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const { comment } = req.body;
    const approved = await LeaveService.approveLeaveRequest(req.user.sub, req.user.companyId, id, comment);
    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully.',
      data: { leaveRequest: approved },
    });
  } catch (error) {
    next(error);
  }
};

export const rejectLeaveRequest = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const { comment } = req.body;
    const rejected = await LeaveService.rejectLeaveRequest(req.user.sub, req.user.companyId, id, comment);
    res.status(200).json({
      success: true,
      message: 'Leave request rejected.',
      data: { leaveRequest: rejected },
    });
  } catch (error) {
    next(error);
  }
};
