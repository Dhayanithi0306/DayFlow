import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Users, Calendar, Clock, DollarSign, FileText, PieChart, Shield } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, switchRole } = useAuth();

  const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr';

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 shrink-0 mt-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-baseline">
          DAYFLOW <span className="ml-1 text-[10px] font-bold text-violet-600 uppercase tracking-widest">HRMS</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4">
        {/* Portal View Card */}
        <div className="bg-violet-50 rounded-xl p-3 mb-6 flex items-center shadow-sm">
          <Shield className="h-5 w-5 text-violet-600 mr-3" />
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Portal View</p>
            <p className="text-sm font-bold text-gray-900">HR Administration</p>
          </div>
        </div>

        <nav className="space-y-1">
          {/* MOCK MODULES */}
          <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Management</div>
          <NavLink to="/mock/dashboard" className="group flex items-center px-3 py-2.5 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors text-gray-600 pointer-events-none">
            <Home className="mr-3 h-5 w-5 opacity-50" />
            HR Overview
          </NavLink>

          {isAdminOrHr && (
            <>
              <NavLink to="/mock/employees" className="group flex items-center px-3 py-2.5 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors text-gray-600 pointer-events-none">
                <Users className="mr-3 h-5 w-5 opacity-50" />
                Employees
              </NavLink>
              <NavLink to="/mock/attendance" className="group flex items-center px-3 py-2.5 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors text-gray-600 pointer-events-none">
                <Clock className="mr-3 h-5 w-5 opacity-50" />
                Attendance Logs
              </NavLink>
              <NavLink to="/mock/leave" className="group flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors text-gray-600 pointer-events-none">
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 opacity-50" />
                  Leave Approvals
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full">1</span>
              </NavLink>
            </>
          )}

          {/* MY MODULES */}
          <NavLink 
            to="/payroll" 
            className={({ isActive }) => `group flex items-center px-3 py-2.5 mt-1 text-sm font-semibold rounded-full transition-colors ${isActive ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            <DollarSign className={`mr-3 h-5 w-5 ${!isAdminOrHr && 'opacity-70'}`} />
            {isAdminOrHr ? 'Salary & Payroll' : 'My Payroll'}
          </NavLink>
          
          {isAdminOrHr && (
            <>
              <div className="px-3 py-2 mt-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Data & Analytics</div>
              <NavLink 
                to="/reports" 
                className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-semibold rounded-full transition-colors ${isActive ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Reports
              </NavLink>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => `group flex items-center px-3 py-2.5 text-sm font-semibold rounded-full transition-colors ${isActive ? 'bg-violet-600 text-white shadow-md shadow-violet-200' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <PieChart className="mr-3 h-5 w-5" />
                Analytics
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Role Switcher at bottom */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Simulate Role</p>
        <div className="flex space-x-1">
          <button onClick={() => switchRole('admin')} className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-colors ${user?.role === 'admin' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>Admin</button>
          <button onClick={() => switchRole('hr')} className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-colors ${user?.role === 'hr' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>HR</button>
          <button onClick={() => switchRole('employee')} className={`flex-1 text-xs px-2 py-1.5 rounded-md font-medium transition-colors ${user?.role === 'employee' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>Emp</button>
        </div>
      </div>
    </div>
  );
};
