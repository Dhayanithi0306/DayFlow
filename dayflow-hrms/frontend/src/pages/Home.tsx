import React, { useEffect, useState } from 'react';
import { healthService } from '../services/api';
import { HealthCheckResult } from '../types';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Monitor, Server, Database, RefreshCw, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="DAYFLOW HRMS — System Foundation Verification"
        subtitle="Stage 4 Global UI System, Shared Component Library & Application Shell Initialized"
        action={
          <Button
            variant="outline"
            size="sm"
            loading={loading}
            onClick={runHealthChecks}
            icon={<RefreshCw size={14} />}
          >
            Re-check System Status
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          icon={<Monitor size={22} />}
          label="Frontend Architecture"
          value="React + Vite"
          description="TypeScript + Tailwind"
          iconColor="sky"
          trend={{ value: 'Connected', isPositive: true }}
        />

        <StatCard
          icon={<Server size={22} />}
          label="Backend API Service"
          value={status.backend ? 'Express API' : 'Offline'}
          description="Port 5000 Engine"
          iconColor="indigo"
          trend={{
            value: status.backend ? 'Online' : 'Offline',
            isPositive: status.backend,
          }}
        />

        <StatCard
          icon={<Database size={22} />}
          label="Database Instance"
          value={status.database ? 'PostgreSQL' : 'Disconnected'}
          description="Prisma ORM Layer"
          iconColor="emerald"
          trend={{
            value: status.database ? 'Connected' : 'Not Connected',
            isPositive: status.database,
          }}
        />
      </div>

      {/* Details Card */}
      <Card title="End-to-End Pipeline Integrity">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            All system components communicate via standard REST interfaces and typed DTOs.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 font-bold text-sky-700">
              <CheckCircle2 size={14} /> Frontend UI
            </div>
            <span className="text-slate-400">→</span>
            <div className="flex items-center gap-1.5 font-bold text-indigo-700">
              <CheckCircle2 size={14} /> Axios Client
            </div>
            <span className="text-slate-400">→</span>
            <div className={`flex items-center gap-1.5 font-bold ${status.backend ? 'text-emerald-700' : 'text-slate-400'}`}>
              {status.backend ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Express Router
            </div>
            <span className="text-slate-400">→</span>
            <div className={`flex items-center gap-1.5 font-bold ${status.database ? 'text-emerald-700' : 'text-slate-400'}`}>
              {status.database ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Prisma ORM
            </div>
            <span className="text-slate-400">→</span>
            <div className={`flex items-center gap-1.5 font-bold ${status.database ? 'text-emerald-700' : 'text-slate-400'}`}>
              {status.database ? <CheckCircle2 size={14} /> : <XCircle size={14} />} PostgreSQL DB
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Security & Authentication:</span>
            <Badge variant="primary" icon={<ShieldCheck size={13} />}>
              bcrypt + JWT Active
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
