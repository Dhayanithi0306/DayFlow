import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setSuccess(false);
      setMessage('No verification token found in URL.');
      return;
    }

    const runVerification = async () => {
      try {
        const res = await authService.verifyEmail(token);
        setSuccess(res.success);
        setMessage(res.message || 'Email verified successfully!');
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.response?.data?.message || err.message || 'Verification failed.');
      } finally {
        setLoading(false);
      }
    };

    runVerification();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6">
        {loading ? (
          <div className="space-y-4 py-8">
            <Loader2 size={48} className="animate-spin text-sky-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying Email Address</h2>
            <p className="text-sm text-slate-400">Communicating with DAYFLOW backend...</p>
          </div>
        ) : success ? (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
              <p className="text-sm text-slate-300">{message}</p>
            </div>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-sky-600/25"
            >
              Sign In to Your Account
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <XCircle size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
              <p className="text-sm text-slate-400">{message}</p>
            </div>
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl border border-slate-700 transition-all text-sm"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
