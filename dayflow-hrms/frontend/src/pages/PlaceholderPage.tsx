import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
}

export const PlaceholderPage: React.FC<Props> = ({ title }) => {
  const location = useLocation();

  return (
    <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center max-w-2xl mx-auto my-12 space-y-6">
      <div className="w-16 h-16 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto border border-sky-500/20">
        <Construction size={32} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-sm font-mono text-slate-400 bg-slate-900/60 py-1.5 px-3 rounded-lg inline-block border border-slate-800">
          Route: {location.pathname}
        </p>
      </div>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        Stage 1 Route Foundation — This endpoint is configured and ready for feature implementation in upcoming stages.
      </p>
    </div>
  );
};
