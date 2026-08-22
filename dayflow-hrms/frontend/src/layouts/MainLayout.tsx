import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ShieldCheck, UserCheck, LogOut, User as UserIcon } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Layers className="text-white" size={22} />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-wide">DAYFLOW</span>
              <span className="text-xs text-sky-400 font-semibold block -mt-1 tracking-wider">HRMS</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Status Verification
            </Link>

            {isAuthenticated && user ? (
              <>
                {user.role === 'EMPLOYEE' && (
                  <Link
                    to="/employee/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname.startsWith('/employee')
                        ? 'bg-slate-800 text-sky-400 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <UserCheck size={16} />
                    Employee Portal
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <ShieldCheck size={16} />
                    Admin Portal
                  </Link>
                )}

                {/* User badge */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold">
                      <UserIcon size={16} />
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="font-semibold text-slate-200 block truncate max-w-[120px]">
                        {user.email}
                      </span>
                      <span className="text-[10px] text-sky-400 uppercase font-mono tracking-wider block">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          DAYFLOW HRMS &bull; Stage 3 Authentication & Role Authorization Active
        </div>
      </footer>
    </div>
  );
};
