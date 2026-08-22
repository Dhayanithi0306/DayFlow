import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Users, Calendar, Clock, DollarSign, FileText, PieChart, LogOut, Settings } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, switchRole } = useAuth();

  const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr';

  return (
    <div className="w-64 bg-gray-900 text-gray-300 h-screen flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800 shrink-0">
        <h1 className="text-xl font-bold text-white tracking-wider">Dayflow</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {/* MOCK MODULES */}
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dashboard</div>
          <NavLink to="/mock/dashboard" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors text-gray-400 pointer-events-none">
            <Home className="mr-3 h-5 w-5 opacity-50" />
            Overview (WIP)
          </NavLink>

          {isAdminOrHr && (
            <>
              <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</div>
              <NavLink to="/mock/employees" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors text-gray-400 pointer-events-none">
                <Users className="mr-3 h-5 w-5 opacity-50" />
                Employees (WIP)
              </NavLink>
              <NavLink to="/mock/attendance" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors text-gray-400 pointer-events-none">
                <Clock className="mr-3 h-5 w-5 opacity-50" />
                Attendance (WIP)
              </NavLink>
              <NavLink to="/mock/leave" className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-800 hover:text-white transition-colors text-gray-400 pointer-events-none">
                <Calendar className="mr-3 h-5 w-5 opacity-50" />
                Leaves (WIP)
              </NavLink>
            </>
          )}

          {/* MY MODULES */}
          <div className="px-3 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Finance & Data</div>
          <NavLink 
            to="/payroll" 
            className={({ isActive }) => `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-indigo-800 text-white' : 'hover:bg-gray-800 hover:text-white text-gray-300'}`}
          >
            <DollarSign className="mr-3 h-5 w-5" />
            {isAdminOrHr ? 'Payroll Management' : 'My Payroll'}
          </NavLink>
          
          {isAdminOrHr && (
            <>
              <NavLink 
                to="/reports" 
                className={({ isActive }) => `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-indigo-800 text-white' : 'hover:bg-gray-800 hover:text-white text-gray-300'}`}
              >
                <FileText className="mr-3 h-5 w-5" />
                Reports
              </NavLink>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-indigo-800 text-white' : 'hover:bg-gray-800 hover:text-white text-gray-300'}`}
              >
                <PieChart className="mr-3 h-5 w-5" />
                Analytics
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center mb-4">
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 uppercase">{user?.role}</p>
          </div>
        </div>
        
        {/* Mock Role Switcher for Demonstration */}
        <div className="mt-2 pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-2">Simulate Role:</p>
          <div className="flex space-x-2">
            <button onClick={() => switchRole('admin')} className={`text-xs px-2 py-1 rounded ${user?.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Admin</button>
            <button onClick={() => switchRole('hr')} className={`text-xs px-2 py-1 rounded ${user?.role === 'hr' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>HR</button>
            <button onClick={() => switchRole('employee')} className={`text-xs px-2 py-1 rounded ${user?.role === 'employee' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'}`}>Emp</button>
          </div>
        </div>
      </div>
    </div>
  );
};
