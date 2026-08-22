import React from 'react';
import { AttendanceSummaryData } from '../../services/attendanceService';
import { StatCard } from '../common/StatCard';
import { formatMinutes } from '../../utils/formatters';
import { CheckCircle2, AlertTriangle, CalendarDays, Zap } from 'lucide-react';

export interface AttendanceSummaryCardsProps {
  summary: AttendanceSummaryData | null;
}

export const AttendanceSummaryCards: React.FC<AttendanceSummaryCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        icon={<CheckCircle2 size={22} />}
        label="Present Days"
        value={summary?.presentCount ?? 0}
        description="Completed workdays"
        iconColor="emerald"
      />

      <StatCard
        icon={<AlertTriangle size={22} />}
        label="Half Days"
        value={summary?.halfDayCount ?? 0}
        description="Partial shifts recorded"
        iconColor="amber"
      />

      <StatCard
        icon={<CalendarDays size={22} />}
        label="On Leave"
        value={summary?.leaveCount ?? 0}
        description="Approved leave days"
        iconColor="sky"
      />

      <StatCard
        icon={<Zap size={22} />}
        label="Total Overtime"
        value={formatMinutes(summary?.totalExtraMinutes)}
        description="Extra shift minutes"
        iconColor="indigo"
      />
    </div>
  );
};
