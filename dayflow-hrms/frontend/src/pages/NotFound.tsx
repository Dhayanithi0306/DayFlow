import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (user) {
      navigate('/employee/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-lg max-w-md w-full space-y-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-100">
          <FileQuestion size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 — Page Not Found</h1>
          <p className="text-xs text-slate-500">
            The route you are looking for does not exist or has been moved.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleBackToDashboard}
          icon={<ArrowLeft size={16} />}
          className="w-full"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
