import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { LogIn, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle, ShieldCheck, UserCheck, Key } from 'lucide-react';

interface LoginProps {
  onSuccessLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccessLogin }) => {
  const { loginUser, switchUserRole } = useHRMS();
  const { setAuthView, rememberMe, setRememberMe } = useAuth();

  const [identifier, setIdentifier] = useState('sarah@dayflow.com'); // Can be email or System Login ID e.g. DAYSJ20230001
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier || !password) {
      setErrorMessage('Please enter both Email / System Login ID and Password.');
      return;
    }

    // Check first-time temporary password condition
    if (password === 'DAYFLOW2026!') {
      if (loginUser(identifier)) {
        setAuthView('first-login');
        return;
      }
    }

    if (loginUser(identifier)) {
      onSuccessLogin();
    } else {
      setErrorMessage('Invalid credentials. Please check your System Login ID or email.');
    }
  };

  const handleQuickDemo = (role: 'employee' | 'admin') => {
    switchUserRole(role);
    onSuccessLogin();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-2xl shadow-xl shadow-indigo-200 mb-4">
          D
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">DAYFLOW HRMS</h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">Human Resource Management System Portal</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100 sm:px-10 space-y-6">
          <div className="text-center border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Sign in to DAYFLOW</h2>
            <p className="text-xs text-slate-500 mt-0.5">Use your System Login ID (e.g. DAYSJ20230001) or Work Email.</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Email or System Login ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                  placeholder="sarah@dayflow.com or DAYSJ20230001"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthView('forgot-password')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <Button variant="primary" type="submit" className="w-full py-3" icon={<LogIn className="h-4 w-4" />}>
              Sign In to Portal
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Don't have an account? </span>
            <button
              onClick={() => setAuthView('signup')}
              className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Sign Up / Register Employee
            </button>
          </div>

          {/* Discreet Developer Demo Shortcuts */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-400 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Demo Quick Sign-in:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickDemo('employee')}
                className="px-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 text-indigo-600" /> Sarah (DAYSJ20230001)
              </button>
              <button
                onClick={() => handleQuickDemo('admin')}
                className="px-2 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-violet-600" /> Alex (DAYAM20210002)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
