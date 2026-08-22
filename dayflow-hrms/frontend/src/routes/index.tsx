import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { PlaceholderPage } from '../pages/PlaceholderPage';

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
        element: <PlaceholderPage title="User Login" />,
      },
      {
        path: 'signup',
        element: <PlaceholderPage title="User Registration (Signup)" />,
      },
      {
        path: 'employee',
        children: [
          {
            index: true,
            element: <PlaceholderPage title="Employee Self-Service Portal" />,
          },
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
        children: [
          {
            index: true,
            element: <PlaceholderPage title="Admin & HR Management Portal" />,
          },
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
