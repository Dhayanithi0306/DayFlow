import { Router } from 'express';
import {
  getEmployeeSalary,
  getEmployeePayrollHistory,
  listAdminPayroll,
  getAdminPayrollSummary,
  getAdminEmployeeSalary,
  updateEmployeeSalary,
  generatePayrollRecords,
} from '../controllers/payrollController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Apply authentication middleware to all payroll endpoints
router.use(authenticateToken);

// Employee Self-Service Endpoints (Read-Only)
router.get('/me/salary', getEmployeeSalary);
router.get('/me', getEmployeePayrollHistory);

// Admin Payroll & Salary Management Endpoints
router.get('/admin/summary', requireRole('ADMIN'), getAdminPayrollSummary);
router.get('/employees/:employeeId/salary', requireRole('ADMIN'), getAdminEmployeeSalary);
router.patch('/employees/:employeeId/salary', requireRole('ADMIN'), updateEmployeeSalary);
router.post('/generate', requireRole('ADMIN'), generatePayrollRecords);
router.get('/', requireRole('ADMIN'), listAdminPayroll);

export default router;
