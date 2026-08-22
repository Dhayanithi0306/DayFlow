import React from 'react';
import { useLocation } from 'react-router-dom';

export const FeaturePlaceholder: React.FC = () => {
  const location = useLocation();
  
  const getFeatureName = () => {
    switch (location.pathname) {
      case '/employee/profile': return 'Profile';
      case '/employee/attendance': return 'Attendance Management';
      case '/employee/leave': return 'Leave Requests';
      case '/employee/payroll': return 'Payroll & Salary Slips';
      default: return 'This feature';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{getFeatureName()}</h2>
      <p className="text-slate-500 max-w-md">
        This module is currently under development. It will be implemented in a future update.
      </p>
    </div>
  );
};
