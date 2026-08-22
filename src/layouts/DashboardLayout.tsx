import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Clock, 
  Calendar, 
  Wallet, 
  LogOut, 
  Bell, 
  Menu,
  X,
  Users,
  FileText,
  BarChart3
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/employee/dashboard': return 'Dashboard';
      case '/employee/profile': return 'My Profile';
      case '/employee/attendance': return 'Attendance';
      case '/employee/leave': return 'Leave Requests';
      case '/employee/payroll': return 'Payroll';
      case '/admin/dashboard': return 'Dashboard';
      case '/admin/employees': return 'Employees';
      case '/admin/attendance': return 'Attendance';
      case '/admin/leave-requests': return 'Leave Requests';
      case '/admin/payroll': return 'Payroll';
      case '/admin/reports': return 'Reports';
      case '/admin/analytics': return 'Analytics';
      default: return 'Dashboard';
    }
  };

  const isAdminOrHR = currentUser?.role === 'admin' || currentUser?.role === 'hr';

  const navItems = isAdminOrHR ? [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/admin/employees', icon: Users },
    { name: 'Attendance', path: '/admin/attendance', icon: Clock },
    { name: 'Leave Requests', path: '/admin/leave-requests', icon: Calendar },
    { name: 'Payroll', path: '/admin/payroll', icon: Wallet },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ] : [
    { name: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/employee/profile', icon: User },
    { name: 'Attendance', path: '/employee/attendance', icon: Clock },
    { name: 'Leave Requests', path: '/employee/leave', icon: Calendar },
    { name: 'Payroll', path: '/employee/payroll', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0 flex-shrink-0 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Dayflow</span>
          </div>
          <button className="lg:hidden text-slate-500" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center">
            <button 
              className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none mr-4"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            
            <div className="flex items-center border-l border-slate-200 pl-4 sm:pl-6 cursor-pointer">
              <div className="text-right mr-3 hidden sm:block">
                <p className="text-sm font-medium text-slate-900 leading-none">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 mt-1 capitalize">{currentUser?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-inner ring-2 ring-white">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};
