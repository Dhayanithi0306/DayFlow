import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button } from '../common/Button';
import { MailCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface EmailVerificationProps {
  onSuccessVerification: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ onSuccessVerification }) => {
  const { registeredEmail, setAuthView } = useAuth();
  const { addToast } = useHRMS();

  const [otp, setOtp] = useState(['5', '9', '2', '8', '4', '1']);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Email verified successfully! Accessing portal...', 'success');
    onSuccessVerification();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-sm border border-indigo-100">
          <MailCheck className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Verify Your Email</h1>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
          We sent a 6-digit verification code to <span className="font-bold text-slate-800">{registeredEmail}</span>.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100 sm:px-10 text-center space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-11 h-12 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              ))}
            </div>

            <Button variant="primary" type="submit" className="w-full py-3" icon={<ArrowRight className="h-4 w-4" />}>
              Verify & Complete Sign Up
            </Button>
          </form>

          <div className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
            <p>Didn't receive code?</p>
            <button
              onClick={() => addToast('Verification code re-sent to ' + registeredEmail, 'info')}
              className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Resend Code
            </button>
            <br />
            <button
              onClick={() => setAuthView('login')}
              className="text-slate-400 hover:text-slate-600 mt-2 block mx-auto cursor-pointer"
            >
              ← Return to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
