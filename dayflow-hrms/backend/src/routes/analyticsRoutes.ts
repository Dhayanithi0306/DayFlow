import { Router } from 'express';
import { getAdminAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/admin', requireRole('ADMIN'), getAdminAnalytics);

export default router;
