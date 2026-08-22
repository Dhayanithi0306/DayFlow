import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Mail, Lock, BadgeCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; token?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);
    setLoading(true);

    try {
      const res = await signup({ employeeId, email, password });
      setSuccessInfo({
        message: 'Account registered successfully! Verification token issued.',
        token: res.verificationToken,
      });
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <UserCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Employee Account Registration</h1>
          <p className="text-sm text-slate-400">Register your official employee account</p>
        </div>

        {/* Success Alert */}
        {successInfo ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 size={18} />
                {successInfo.message}
              </div>
              <p className="text-xs text-slate-300">
                Please verify your email address to log in.
              </p>

              {successInfo.token && (
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Development Verification Token:</p>
                  <p className="text-sky-400 select-all break-all">{successInfo.token}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {successInfo.token && (
                <Link
                  to={`/verify-email?token=${successInfo.token}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md"
                >
                  Verify Email Now
                </Link>
              )}
              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl border border-slate-700 transition-all text-sm"
              >
                Go to Login
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <BadgeCheck size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="DAYENG20260002"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.dev@dayflow.tech"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number & 1 special character.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? 'Processing...' : 'Register Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Already registered?{' '}
              <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
