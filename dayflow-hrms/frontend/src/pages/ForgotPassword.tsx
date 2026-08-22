import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { KeyRound, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<{ message: string; resetToken?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessInfo(null);

    try {
      const res = await authService.forgotPassword(email);
      setSuccessInfo({
        message: res.message || 'If an account exists, a reset link has been requested.',
        resetToken: res.data?.resetToken,
      });
    } catch (err) {
      setSuccessInfo({
        message: 'If an account exists, a reset link has been requested.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mx-auto border border-sky-500/20">
            <KeyRound size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-sm text-slate-400">Enter your email address to receive password reset instructions.</p>
        </div>

        {successInfo ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 size={18} />
                Request Submitted
              </div>
              <p className="text-xs text-slate-300">{successInfo.message}</p>

              {successInfo.resetToken && (
                <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Development Password Reset Token:</p>
                  <p className="text-sky-400 select-all break-all">{successInfo.resetToken}</p>
                </div>
              )}
            </div>

            {successInfo.resetToken && (
              <Link
                to={`/reset-password?token=${successInfo.resetToken}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md"
              >
                Proceed to Reset Password
              </Link>
            )}

            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl border border-slate-700 text-sm"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Registered Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-sky-600/25 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Reset Link'}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Remember your password?{' '}
              <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
