import { Router } from 'express';
import {
  createLeaveRequest,
  getEmployeeLeaveHistory,
  getEmployeeLeaveBalances,
  listAdminLeaveRequests,
  getAdminLeaveSummary,
  approveLeaveRequest,
  rejectLeaveRequest,
} from '../controllers/leaveController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Apply authentication middleware to all leave endpoints
router.use(authenticateToken);

// Employee Self-Service Endpoints
router.post('/', createLeaveRequest);
router.get('/me', getEmployeeLeaveHistory);
router.get('/me/balance', getEmployeeLeaveBalances);

// Admin Leave Management Endpoints
router.get('/admin/summary', requireRole('ADMIN'), getAdminLeaveSummary);
router.get('/', requireRole('ADMIN'), listAdminLeaveRequests);
router.patch('/:id/approve', requireRole('ADMIN'), approveLeaveRequest);
router.patch('/:id/reject', requireRole('ADMIN'), rejectLeaveRequest);

export default router;
