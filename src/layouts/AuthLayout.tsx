import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding/Hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/80 to-transparent"></div>
        
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-indigo-600 rounded-sm"></div>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Dayflow</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Every workday,<br/>perfectly aligned.
          </h1>
          <p className="text-indigo-200 text-lg">
            Streamline your HR operations, empower your workforce, and manage your entire employee lifecycle from a single, unified platform.
          </p>
        </div>
      </div>

      {/* Right side - Form area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
