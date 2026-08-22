import React from 'react';
import { LeaveBalance } from '../../types';
import { StatCard } from '../common/StatCard';
import { CalendarDays, Stethoscope, Clock } from 'lucide-react';

export interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
}

export const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({ balances }) => {
  const getBalance = (type: string) => {
    return balances.find((b) => b.leaveType === type) || { allocatedDays: 0, usedDays: 0, remainingDays: 0 };
  };

  const paid = getBalance('PAID');
  const sick = getBalance('SICK');
  const unpaid = getBalance('UNPAID');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard
        icon={<CalendarDays size={22} />}
        label="Paid Leave"
        value={`${paid.remainingDays} Days`}
        description={`${paid.usedDays} used of ${paid.allocatedDays} allocated`}
        iconColor="indigo"
      />

      <StatCard
        icon={<Stethoscope size={22} />}
        label="Sick Leave"
        value={`${sick.remainingDays} Days`}
        description={`${sick.usedDays} used of ${sick.allocatedDays} allocated`}
        iconColor="amber"
      />

      <StatCard
        icon={<Clock size={22} />}
        label="Unpaid Leave"
        value={`${unpaid.remainingDays} Days`}
        description={`${unpaid.usedDays} used of ${unpaid.allocatedDays} allocated`}
        iconColor="sky"
      />
    </div>
  );
};
