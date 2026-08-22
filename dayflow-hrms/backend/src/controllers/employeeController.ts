import { Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employeeService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const getSelfProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const profile = await EmployeeService.getSelfProfile(req.user.sub);
    res.status(200).json({
      success: true,
      data: { employee: profile },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSelfProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const updated = await EmployeeService.updateSelfProfile(req.user.sub, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { employee: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const getSelfDocuments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const profile = await EmployeeService.getSelfProfile(req.user.sub);
    const docs = await EmployeeService.getEmployeeDocuments(req.user.companyId, profile.id);
    res.status(200).json({
      success: true,
      data: { documents: docs },
    });
  } catch (error) {
    next(error);
  }
};

export const getSelfSalary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const profile = await EmployeeService.getSelfProfile(req.user.sub);
    const salary = await EmployeeService.getEmployeeSalary(req.user.companyId, profile.id);
    res.status(200).json({
      success: true,
      data: { salaryStructures: salary },
    });
  } catch (error) {
    next(error);
  }
};

export const listEmployees = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await EmployeeService.listEmployees(req.user.companyId, req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const employee = await EmployeeService.getEmployeeById(req.user.companyId, id);
    res.status(200).json({
      success: true,
      data: { employee },
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const result = await EmployeeService.createEmployee(req.user.sub, req.user.companyId, req.body);
    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        employee: result.employee,
        tempPassword: result.tempPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const updated = await EmployeeService.updateEmployee(req.user.sub, req.user.companyId, id, req.body);
    res.status(200).json({
      success: true,
      message: 'Employee updated successfully.',
      data: { employee: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployeeStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.sub || !req.user.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const { status } = req.body;
    const updated = await EmployeeService.updateEmployeeStatus(req.user.sub, req.user.companyId, id, status);
    res.status(200).json({
      success: true,
      message: `Employee status updated to ${status}.`,
      data: { employee: updated },
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeDocuments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const docs = await EmployeeService.getEmployeeDocuments(req.user.companyId, id);
    res.status(200).json({
      success: true,
      data: { documents: docs },
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeSalary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user?.companyId) {
      res.status(401).json({ success: false, message: 'Unauthenticated request.' });
      return;
    }
    const id = req.params.id as string;
    const salary = await EmployeeService.getEmployeeSalary(req.user.companyId, id);
    res.status(200).json({
      success: true,
      data: { salaryStructures: salary },
    });
  } catch (error) {
    next(error);
  }
};
