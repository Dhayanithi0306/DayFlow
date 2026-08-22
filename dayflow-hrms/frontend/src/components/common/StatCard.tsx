import React, { ReactNode } from 'react';

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  iconColor?: 'indigo' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet';
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  description,
  trend,
  iconColor = 'indigo',
}) => {
  const iconColorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        {(description || trend) && (
          <div className="flex items-center gap-2 pt-1">
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {trend.value}
              </span>
            )}
            {description && <span className="text-xs text-slate-500">{description}</span>}
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${iconColorStyles[iconColor]}`}>
        {icon}
      </div>
    </div>
  );
};
