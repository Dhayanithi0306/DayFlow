import React, { useEffect, useState } from 'react';
import { healthService } from '../services/api';
import { HealthCheckResult } from '../types';
import { CheckCircle2, XCircle, RefreshCw, Server, Database, Monitor, ShieldCheck, Activity } from 'lucide-react';

export const Home: React.FC = () => {
  const [status, setStatus] = useState<HealthCheckResult>({
    frontend: true,
    backend: false,
    database: false,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const runHealthChecks = async () => {
    setLoading(true);
    const result = await healthService.verifyFullConnection();
    setStatus(result);
    setLoading(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Title & Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-sky-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold tracking-wide uppercase">
            <Activity size={14} className="animate-pulse" />
            Stage 1: Architecture Initialized
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">DAYFLOW HRMS</h1>
          <p className="text-slate-300 text-base max-w-2xl">
            Project initialized successfully. Clean monorepo structure, TypeScript environment, Express backend, Prisma ORM, and React frontend configuration.
          </p>
        </div>
      </div>

      {/* Connection Status Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            System Connection Status
          </h2>
          <button
            onClick={runHealthChecks}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-sky-400' : ''} />
            {loading ? 'Checking...' : 'Re-check Connection'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Frontend Status */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                <Monitor size={22} />
              </div>
              {status.frontend ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 size={14} /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
                  <XCircle size={14} /> Disconnected
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Frontend</h3>
              <p className="text-xs text-slate-400 mt-1">React 18 + Vite + TypeScript</p>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">
              Frontend: <span className="text-emerald-400 font-mono font-semibold">Connected</span>
            </div>
          </div>

          {/* Backend Status */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Server size={22} />
              </div>
              {status.backend ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 size={14} /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
                  <XCircle size={14} /> Offline
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Backend</h3>
              <p className="text-xs text-slate-400 mt-1">Express API on port 5000</p>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-800 truncate" title={status.backendMessage || ''}>
              Backend: <span className={status.backend ? 'text-emerald-400 font-mono font-semibold' : 'text-red-400 font-mono font-semibold'}>
                {status.backend ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Database Status */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Database size={22} />
              </div>
              {status.database ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 size={14} /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                  <XCircle size={14} /> Not Connected
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Database</h3>
              <p className="text-xs text-slate-400 mt-1">PostgreSQL via Prisma ORM</p>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-800 truncate" title={status.databaseMessage || ''}>
              Database: <span className={status.database ? 'text-emerald-400 font-mono font-semibold' : 'text-amber-400 font-mono font-semibold'}>
                {status.database ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Pipeline Verification */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck size={18} className="text-sky-400" />
          End-to-End Connection Pipeline
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-sm font-mono">
          <span className="text-emerald-400 font-semibold">Frontend</span>
          <span className="text-slate-600">→</span>
          <span className="text-sky-400 font-semibold">Axios Service</span>
          <span className="text-slate-600">→</span>
          <span className={status.backend ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>Express Backend</span>
          <span className="text-slate-600">→</span>
          <span className={status.database ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>Prisma ORM</span>
          <span className="text-slate-600">→</span>
          <span className={status.database ? 'text-purple-400 font-semibold' : 'text-slate-500'}>PostgreSQL</span>
        </div>
      </div>
    </div>
  );
};
