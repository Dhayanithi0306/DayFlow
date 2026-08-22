import { Router } from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/', globalSearch);

export default router;
