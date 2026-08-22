import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', requireRole('ADMIN'), getAuditLogs);

export default router;
