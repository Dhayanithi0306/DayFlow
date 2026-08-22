import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockVerifyEmail } from '../../services/authService';

export const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      await mockVerifyEmail(code);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Verify your email</h2>
        <p className="text-slate-500 mt-2">
          We've sent a 6-digit code to<br />
          <span className="font-medium text-slate-900">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-left">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <Input
          label="Verification Code"
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          className="text-center text-lg tracking-[0.5em] font-medium"
        />

        <Button type="submit" isLoading={isLoading}>
          Verify Email
        </Button>
      </form>

      <div className="mt-8">
        <button 
          disabled={countdown > 0}
          onClick={() => setCountdown(60)}
          className={`text-sm font-medium ${countdown > 0 ? 'text-slate-400' : 'text-indigo-600 hover:text-indigo-500'}`}
        >
          {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};
