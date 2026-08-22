import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { VerifyEmail } from '../pages/auth/VerifyEmail';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { AdminDashboard } from '../pages/dashboard/Placeholders';
import { EmployeeDashboard } from '../pages/employee/Dashboard';
import { EmployeeProfilePage } from '../pages/employee/Profile';
import { EmployeeAttendancePage } from '../pages/employee/Attendance';
import { EmployeeLeavePage } from '../pages/employee/Leave';
import { EmployeePayrollPage } from '../pages/employee/Payroll';
import { SalarySlipPage } from '../pages/employee/SalarySlip';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { NotFound } from '../pages/NotFound';

// Simple wrapper to redirect already logged in users away from auth pages
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, currentUser } = useAuth();
  if (isAuthenticated && currentUser) {
    return <Navigate to={currentUser.role === 'employee' ? '/employee/dashboard' : '/admin/dashboard'} replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthRoute>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      { index: true, element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'verify-email', element: <VerifyEmail /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={['employee']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <EmployeeDashboard /> },
      { path: 'profile', element: <EmployeeProfilePage /> },
      { path: 'attendance', element: <EmployeeAttendancePage /> },
      { path: 'leave', element: <EmployeeLeavePage /> },
      { path: 'payroll', element: <EmployeePayrollPage /> },
      { path: 'payroll/:id/slip', element: <SalarySlipPage /> },
    ],
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'hr']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
