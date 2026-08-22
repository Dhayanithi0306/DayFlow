import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { ChangePasswordPage } from './features/auth/ChangePasswordPage';

import { AdminLayout } from './layouts/AdminLayout';
import { HRLayout } from './layouts/HRLayout';
import { EmployeeLayout } from './layouts/EmployeeLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Semi-Protected Route (Requires Auth, handles first login) */}
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Role-Based Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/hr/*" 
            element={
              <ProtectedRoute allowedRoles={['HR']}>
                <HRLayout />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/employee/*" 
            element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <EmployeeLayout />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all redirect to ProtectedRoute to handle default routing based on role */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
