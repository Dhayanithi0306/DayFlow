import { Router } from 'express';
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getEmployeeAttendance,
  getEmployeeSummary,
  listAdminAttendance,
  getAdminSummary,
  updateAttendance,
} from '../controllers/attendanceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Apply authentication middleware to all attendance endpoints
router.use(authenticateToken);

// Employee Self-Service Endpoints
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/me/today', getTodayAttendance);
router.get('/me', getEmployeeAttendance);
router.get('/me/summary', getEmployeeSummary);

// Admin Attendance Management Endpoints
router.get('/admin/summary', requireRole('ADMIN'), getAdminSummary);
router.get('/', requireRole('ADMIN'), listAdminAttendance);
router.patch('/:id', requireRole('ADMIN'), updateAttendance);

export default router;
