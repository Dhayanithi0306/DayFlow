import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { PayrollPage } from './pages/PayrollPage';
import { SalarySlipPage } from './pages/SalarySlipPage';
import { ReportsPage } from './pages/ReportsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

// Simple guard for Admin/HR routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== 'admin' && user?.role !== 'hr') {
    return <Navigate to="/payroll" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/payroll" replace />} />
        
        {/* Payroll routes accessible by everyone (Employee view vs Admin view handled inside component) */}
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="payroll/:id/slip" element={<SalarySlipPage />} />

        {/* Admin/HR only routes */}
        <Route path="reports" element={
          <AdminRoute>
            <ReportsPage />
          </AdminRoute>
        } />
        
        <Route path="analytics" element={
          <AdminRoute>
            <AnalyticsPage />
          </AdminRoute>
        } />

        {/* Mock Catch-alls for other team members' modules */}
        <Route path="mock/*" element={<div className="p-8 text-gray-500">This module is currently being developed by another team member.</div>} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
