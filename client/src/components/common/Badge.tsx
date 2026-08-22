import React from 'react';
import { AttendanceStatus, LeaveStatus } from '../../types/hrms';

interface BadgeProps {
  status: AttendanceStatus | LeaveStatus | string;
  variant?: 'default' | 'pill';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md' }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    // Attendance statuses
    case 'Present':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium';
      break;
    case 'Absent':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium';
      break;
    case 'Half-day':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80 font-medium';
      break;
    case 'Leave':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200/80 font-medium';
      break;

    // Leave statuses
    case 'Pending':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80 font-medium';
      break;
    case 'Approved':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium';
      break;
    case 'Rejected':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium';
      break;

    // Active status
    case 'Active':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium';
      break;
    case 'Inactive':
      colorClasses = 'bg-slate-100 text-slate-600 border-slate-200 font-medium';
      break;

    default:
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200/80 font-medium';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75"></span>
      {status}
    </span>
  );
};
