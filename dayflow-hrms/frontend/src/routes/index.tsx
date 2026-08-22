import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { VerifyEmail } from '../pages/VerifyEmail';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { ChangePassword } from '../pages/ChangePassword';
import { Unauthorized } from '../pages/Unauthorized';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter([
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
      {
        path: 'employee',
        element: (
          <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
            <PlaceholderPage title="Employee Portal" />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <PlaceholderPage title="Employee Dashboard" />,
          },
          {
            path: 'profile',
            element: <PlaceholderPage title="Employee Profile Management" />,
          },
          {
            path: 'attendance',
            element: <PlaceholderPage title="Employee Attendance & Check-in" />,
          },
          {
            path: 'time-off',
            element: <PlaceholderPage title="Employee Time Off & Leave Requests" />,
          },
          {
            path: 'payroll',
            element: <PlaceholderPage title="Employee Salary & Payroll Slips" />,
          },
        ],
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PlaceholderPage title="Admin Portal" />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <PlaceholderPage title="Admin Overview & Analytics Dashboard" />,
          },
          {
            path: 'employees',
            element: <PlaceholderPage title="Admin Employee Directory Management" />,
          },
          {
            path: 'attendance',
            element: <PlaceholderPage title="Admin Attendance Monitoring" />,
          },
          {
            path: 'time-off',
            element: <PlaceholderPage title="Admin Time Off Request Approvals" />,
          },
          {
            path: 'payroll',
            element: <PlaceholderPage title="Admin Payroll & Salary Processing" />,
          },
        ],
      },
      {
        path: '*',
        element: <PlaceholderPage title="404 — Page Not Found" />,
      },
    ],
  },
]);
