import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useHRMS();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="h-5 w-5 text-indigo-500" />;
        let borderClass = 'border-indigo-200 bg-white text-slate-800';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
          borderClass = 'border-emerald-200 bg-emerald-50/90 text-emerald-900';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="h-5 w-5 text-rose-500" />;
          borderClass = 'border-rose-200 bg-rose-50/90 text-rose-900';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="h-5 w-5 text-amber-500" />;
          borderClass = 'border-amber-200 bg-amber-50/90 text-amber-900';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all duration-200 animate-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="shrink-0">{icon}</span>
              <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
