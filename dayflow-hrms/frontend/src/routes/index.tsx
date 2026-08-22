import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AppLayout } from '../layouts/AppLayout';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { VerifyEmail } from '../pages/VerifyEmail';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { ChangePassword } from '../pages/ChangePassword';
import { Unauthorized } from '../pages/Unauthorized';
import { NotFound } from '../pages/NotFound';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Real Employee Pages
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { EmployeeProfile } from '../pages/employee/EmployeeProfile';
import { EmployeeAttendance } from '../pages/employee/EmployeeAttendance';
import { EmployeeTimeOff } from '../pages/employee/EmployeeTimeOff';

// Real Admin Pages
import { EmployeeDirectory } from '../pages/admin/EmployeeDirectory';
import { EmployeeDetails } from '../pages/admin/EmployeeDetails';
import { AdminAttendance } from '../pages/admin/AdminAttendance';
import { AdminTimeOff } from '../pages/admin/AdminTimeOff';

export const router = createBrowserRouter([
  // Public & Auth Routes (rendered with minimal header via MainLayout)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'change-password',
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
    ],
  },

  // Authenticated Employee Portal Routes (rendered within full AppLayout shell)
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <EmployeeDashboard />,
      },
      {
        path: 'dashboard',
        element: <EmployeeDashboard />,
      },
      {
        path: 'profile',
        element: <EmployeeProfile />,
      },
      {
        path: 'attendance',
        element: <EmployeeAttendance />,
      },
      {
        path: 'time-off',
        element: <EmployeeTimeOff />,
      },
      {
        path: 'payroll',
        element: <PlaceholderPage title="Employee Salary & Payroll Slips (Coming in Stage 8)" />,
      },
    ],
  },

  // Authenticated Admin Portal Routes (rendered within full AppLayout shell)
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <EmployeeDirectory />,
      },
      {
        path: 'dashboard',
        element: <EmployeeDirectory />,
      },
      {
        path: 'employees',
        element: <EmployeeDirectory />,
      },
      {
        path: 'employees/:id',
        element: <EmployeeDetails />,
      },
      {
        path: 'attendance',
        element: <AdminAttendance />,
      },
      {
        path: 'time-off',
        element: <AdminTimeOff />,
      },
      {
        path: 'payroll',
        element: <PlaceholderPage title="Admin Payroll & Salary Processing (Coming in Stage 8)" />,
      },
    ],
  },

  // Wildcard 404 Route
  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
