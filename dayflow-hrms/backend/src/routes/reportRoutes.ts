import { Router } from 'express';
import {
  getEmployeeReport,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  exportEmployeeReport,
  exportAttendanceReport,
  exportLeaveReport,
  exportPayrollReport,
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Apply authentication & admin role guard to all report endpoints
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

// Report JSON Endpoints
router.get('/employees', getEmployeeReport);
router.get('/attendance', getAttendanceReport);
router.get('/leave', getLeaveReport);
router.get('/payroll', getPayrollReport);

// Report CSV Export Endpoints
router.get('/employees/export', exportEmployeeReport);
router.get('/attendance/export', exportAttendanceReport);
router.get('/leave/export', exportLeaveReport);
router.get('/payroll/export', exportPayrollReport);

export default router;
