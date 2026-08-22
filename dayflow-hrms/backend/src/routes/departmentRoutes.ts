import { Router } from 'express';
import { listDepartments } from '../controllers/departmentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/', listDepartments);

export default router;
