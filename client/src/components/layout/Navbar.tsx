import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import {
  Clock,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigateToProfile, onLogout }) => {
  const { currentUser, isCheckedIn, checkInTime, elapsedSeconds, toggleCheckIn } = useHRMS();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-200">
              D
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-800 bg-clip-text text-transparent">
                  DAYFLOW
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-widest border border-indigo-100">
                  HRMS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Check-in status & User profile */}
        <div className="flex items-center gap-3">
          {/* Quick Check-in Button widget */}
          <div className="flex items-center gap-2">
            {isCheckedIn && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
                <Clock className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
                {formatTimer(elapsedSeconds)}
              </div>
            )}

            <button
              onClick={toggleCheckIn}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                isCheckedIn
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isCheckedIn ? 'bg-rose-500 animate-ping' : 'bg-emerald-200'}`} />
              {isCheckedIn ? `Clock Out (${checkInTime})` : 'Clock In Now'}
            </button>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="h-8 w-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{currentUser?.name}</p>
                <div className="mt-1 flex items-center gap-1">
                  <Badge status={currentUser?.role === 'admin' ? 'HR Admin' : 'Employee'} size="sm" />
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {/* Dropdown menu */}
            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                </div>

                <button
                  onClick={onNavigateToProfile}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" /> View Profile
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-500" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
