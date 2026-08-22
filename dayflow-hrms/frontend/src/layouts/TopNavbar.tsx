import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import {
  Menu,
  Bell,
  Search,
  User,
  KeyRound,
  LogOut,
  ChevronDown,
  Inbox,
  CheckCheck,
} from 'lucide-react';

export interface TopNavbarProps {
  onMenuClick?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { unreadCount, notifications, fetchNotifications, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  const handleOpenNotifications = () => {
    fetchNotifications();
    setNotificationsOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/employee/profile');
    }
  };

  const displayName = user?.employee
    ? `${user.employee.firstName} ${user.employee.lastName}`
    : user?.email || 'User';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 h-16 flex items-center px-4 sm:px-6 justify-between shadow-xs">
      {/* Left: Mobile Menu Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Input */}
        <div className="relative hidden sm:block max-w-xs w-64">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search HRMS portal..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Actions: Notifications & User Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon & Unread Count Badge */}
        <button
          onClick={handleOpenNotifications}
          title="Notifications"
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors relative cursor-pointer"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full leading-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Modal */}
        <Modal
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          title="Notifications"
          maxWidth="md"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'All caught up'}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck size={14} /> Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Inbox size={24} />
                </div>
                <p className="text-sm font-semibold text-slate-800">No notifications yet</p>
                <p className="text-xs text-slate-500">Workday alerts and HR status updates will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (!n.isRead) markRead(n.id);
                      if (n.linkUrl) {
                        setNotificationsOpen(false);
                        navigate(n.linkUrl);
                      }
                    }}
                    className={`p-3 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                      !n.isRead ? 'bg-indigo-50/60 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${!n.isRead ? 'text-indigo-950' : 'text-slate-900'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 text-center">
              <Link
                to="/notifications"
                onClick={() => setNotificationsOpen(false)}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View All Notifications Center →
              </Link>
            </div>
          </div>
        </Modal>

        {/* User Menu Trigger */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Avatar name={displayName} src={user?.employee?.profilePictureUrl} size="md" />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-500 font-mono uppercase">{user?.role}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400 hidden lg:block" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-1">
                    <Badge variant={user?.role === 'ADMIN' ? 'primary' : 'info'} size="sm">
                      {user?.role}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <User size={15} />
                  <span>Profile Overview</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/change-password');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <KeyRound size={15} />
                  <span>Change Password</span>
                </button>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
