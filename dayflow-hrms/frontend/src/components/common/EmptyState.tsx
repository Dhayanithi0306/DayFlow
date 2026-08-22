import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  icon = <Inbox size={36} className="text-slate-400" />,
  action,
  className = '',
}) => {
  return (
    <div className={`p-8 rounded-2xl border border-dashed border-slate-300 text-center flex flex-col items-center justify-center space-y-3 bg-slate-50/50 ${className}`}>
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
        {icon}
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
