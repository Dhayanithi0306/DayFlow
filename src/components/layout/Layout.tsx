import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Clock, ChevronDown } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-end px-8 shrink-0">
          <div className="flex items-center space-x-6">
            <button className="flex items-center bg-emerald-500 hover:bg-emerald-600 transition-colors text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm shadow-emerald-200">
              <Clock className="w-4 h-4 mr-2" />
              Clock In Now
            </button>
            
            <div className="flex items-center cursor-pointer hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-sm">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-3 mr-2 text-right">
                <p className="text-sm font-bold leading-none text-gray-900">{user?.name}</p>
                <p className="text-[10px] font-bold text-violet-600 mt-1 uppercase tracking-wider leading-none">
                  {user?.role === 'hr' ? 'HR Admin' : user?.role === 'admin' ? 'System Admin' : 'Employee'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-8 pb-12 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
