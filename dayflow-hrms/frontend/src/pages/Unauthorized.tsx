import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-red-500/20 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
          <ShieldX size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">403 — Access Denied</h1>
          <p className="text-sm text-slate-400">
            You do not have permission to access this resource. Role authorization restriction applied.
          </p>
        </div>
        <Link
          to="/"
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl border border-slate-700 transition-all text-sm"
        >
          <ArrowLeft size={18} />
          Return to Status Home
        </Link>
      </div>
    </div>
  );
};
