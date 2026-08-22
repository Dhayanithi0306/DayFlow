import React, { useState } from 'react';
import { useAuth, generateSystemLoginId } from '../../context/AuthContext';
import { Button } from '../common/Button';
import type { Role } from '../../types/hrms';
import { UserPlus, Mail, Lock, ShieldCheck, UserCheck, AlertCircle, Building2, Phone, Upload, Sparkles } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { setAuthView, registerNewUser } = useAuth();

  const [companyName, setCompanyName] = useState('Acme Global Inc.');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('DAYFLOW2026!');
  const [confirmPassword, setConfirmPassword] = useState('DAYFLOW2026!');
  const [role, setRole] = useState<Role>('employee');
  const [errorMessage, setErrorMessage] = useState('');

  const previewLoginId = name ? generateSystemLoginId(name) : 'DAYXX20260000';

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    registerNewUser(companyName, companyLogo, name, email, phone, password, role);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white font-black text-2xl shadow-xl shadow-indigo-200 mb-4">
          D
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">DAYFLOW HRMS</h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">Create an organization account & auto-generate Login ID</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100 sm:px-10 space-y-5">
          <div className="text-center border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Register Employee / HR Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your System Login ID will be assigned automatically.</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {name && (
            <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200/80 text-xs text-indigo-950 flex items-center justify-between animate-in fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Generated System Login ID
                </span>
                <span className="font-mono font-black text-sm text-indigo-700 block mt-0.5">{previewLoginId}</span>
              </div>
              <span className="px-2 py-1 rounded bg-white text-[10px] font-bold text-indigo-700 border border-indigo-100">
                Auto-assigned
              </span>
            </div>
          )}

          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            {/* Company Name & Logo */}
            <div className="grid grid-cols-3 gap-3 items-center">
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Logo</label>
                <label className="flex items-center justify-center p-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  {companyLogo ? (
                    <img src={companyLogo} alt="Logo" className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <Upload className="h-3 w-3" /> Upload
                    </span>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Employee Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@dayflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="+1 (555) 000-1122"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Access Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('employee')}
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all ${
                    role === 'employee'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="h-4 w-4" /> Employee
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all ${
                    role === 'admin'
                      ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" /> HR / Admin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Temporary Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <Button variant="primary" type="submit" className="w-full py-3" icon={<UserPlus className="h-4 w-4" />}>
              Create Account & Issue Login ID
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Already have a Login ID? </span>
            <button
              onClick={() => setAuthView('login')}
              className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
