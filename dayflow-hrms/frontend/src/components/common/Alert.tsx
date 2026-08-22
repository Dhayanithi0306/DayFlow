import React, { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  onDismiss,
  className = '',
}) => {
  const variantStyles: Record<AlertVariant, { container: string; icon: JSX.Element }> = {
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-900',
      icon: <Info size={18} className="text-sky-600 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle size={18} className="text-amber-600 shrink-0" />,
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle size={18} className="text-rose-600 shrink-0" />,
    },
  };

  return (
    <div className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-sm ${variantStyles[variant].container} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{variantStyles[variant].icon}</span>
        <div>
          {title && <h4 className="font-bold tracking-tight mb-0.5">{title}</h4>}
          <div className="text-xs leading-relaxed">{children}</div>
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors cursor-pointer">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
