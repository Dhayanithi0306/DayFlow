import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { UserRole } from './auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading session...</div>;
  }

  if (!isAuthenticated || !user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force first login users to change their password
  if (user.firstLogin && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  // If roles are defined, ensure the user has one of them
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Determine the default dashboard based on role
    let defaultPath = '/';
    if (user.role === 'ADMIN') defaultPath = '/admin';
    if (user.role === 'HR') defaultPath = '/hr';
    if (user.role === 'EMPLOYEE') defaultPath = '/employee';
    
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};
