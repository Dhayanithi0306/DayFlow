import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const EmployeeDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Employee Dashboard — Coming next</h1>
      <p className="text-slate-600 mb-8">Welcome, {currentUser?.name}. You are logged in as an {currentUser?.role}.</p>
      <div className="w-48">
        <Button onClick={logout} variant="outline">Sign Out</Button>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Admin Dashboard — Coming next</h1>
      <p className="text-slate-600 mb-8">Welcome, {currentUser?.name}. You are logged in as {currentUser?.role === 'hr' ? 'HR' : 'Admin'}.</p>
      <div className="w-48">
        <Button onClick={logout} variant="outline">Sign Out</Button>
      </div>
    </div>
  );
};
