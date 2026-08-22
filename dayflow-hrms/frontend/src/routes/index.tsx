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

// Real Admin Pages
import { EmployeeDirectory } from '../pages/admin/EmployeeDirectory';
import { EmployeeDetails } from '../pages/admin/EmployeeDetails';

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
        element: <PlaceholderPage title="Employee Attendance & Check-in (Coming in Stage 6)" />,
      },
      {
        path: 'time-off',
        element: <PlaceholderPage title="Employee Time Off & Leave Requests (Coming in Stage 7)" />,
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
        element: <PlaceholderPage title="Admin Attendance Monitoring (Coming in Stage 6)" />,
      },
      {
        path: 'time-off',
        element: <PlaceholderPage title="Admin Time Off Request Approvals (Coming in Stage 7)" />,
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
