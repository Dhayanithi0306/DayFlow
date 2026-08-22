import { Router } from 'express';
import {
  getSelfProfile,
  updateSelfProfile,
  getSelfDocuments,
  getSelfSalary,
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  getEmployeeDocuments,
  getEmployeeSalary,
} from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Apply authentication middleware to all employee endpoints
router.use(authenticateToken);

// Employee Self-Service Endpoints (Any authenticated user)
router.get('/me', getSelfProfile);
router.get('/me/profile', getSelfProfile);
router.patch('/me/profile', updateSelfProfile);
router.get('/me/documents', getSelfDocuments);
router.get('/me/salary', getSelfSalary);

// Admin Only Employee Management Endpoints
router.get('/', requireRole('ADMIN'), listEmployees);
router.get('/:id', requireRole('ADMIN'), getEmployeeById);
router.post('/', requireRole('ADMIN'), createEmployee);
router.patch('/:id', requireRole('ADMIN'), updateEmployee);
router.patch('/:id/status', requireRole('ADMIN'), updateEmployeeStatus);
router.get('/:id/documents', requireRole('ADMIN'), getEmployeeDocuments);
router.get('/:id/salary', requireRole('ADMIN'), getEmployeeSalary);

export default router;
