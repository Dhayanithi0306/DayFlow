import { Router } from 'express';
import { getEmployeeDashboard, getAdminDashboard } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/employee', getEmployeeDashboard);
router.get('/admin', requireRole('ADMIN'), getAdminDashboard);

export default router;
