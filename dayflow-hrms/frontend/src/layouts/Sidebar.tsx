import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  CreditCard,
  Users,
  X,
} from 'lucide-react';

export interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'EMPLOYEE';

  const employeeLinks = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/employee/dashboard' },
    { label: 'Profile', icon: <User size={18} />, to: '/employee/profile' },
    { label: 'Attendance', icon: <Clock size={18} />, to: '/employee/attendance' },
    { label: 'Time Off', icon: <CalendarDays size={18} />, to: '/employee/time-off' },
    { label: 'Payroll', icon: <CreditCard size={18} />, to: '/employee/payroll' },
  ];

  const adminLinks = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/admin/dashboard' },
    { label: 'Employees', icon: <Users size={18} />, to: '/admin/employees' },
    { label: 'Attendance', icon: <Clock size={18} />, to: '/admin/attendance' },
    { label: 'Time Off', icon: <CalendarDays size={18} />, to: '/admin/time-off' },
    { label: 'Payroll', icon: <CreditCard size={18} />, to: '/admin/payroll' },
  ];

  const navLinks = role === 'ADMIN' ? adminLinks : employeeLinks;

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold">
            <Layers size={22} />
          </div>
          <div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight block leading-tight">
              DAYFLOW
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider block">
              HRMS Platform
            </span>
          </div>
        </div>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Role Indicator Banner */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Portal Context
        </span>
        <span
          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
            role === 'ADMIN'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              : 'bg-sky-100 text-sky-700 border border-sky-200'
          }`}
        >
          {role}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs border border-indigo-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Tagline */}
      <div className="p-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 italic">Every workday, perfectly aligned.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30">{content}</aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onMobileClose} />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
};
