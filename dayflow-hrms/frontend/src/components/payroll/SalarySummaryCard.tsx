import React from 'react';
import { StatCard } from '../common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, ShieldAlert, Wallet } from 'lucide-react';

export interface SalarySummaryCardProps {
  grossSalary?: string | number;
  totalDeductions?: string | number;
  netSalary?: string | number;
  currency?: string;
}

export const SalarySummaryCard: React.FC<SalarySummaryCardProps> = ({
  grossSalary = 0,
  totalDeductions = 0,
  netSalary = 0,
  currency = 'INR',
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard
        icon={<DollarSign size={22} />}
        label="Gross Monthly Salary"
        value={formatCurrency(grossSalary, currency)}
        description="Total earnings before deductions"
        iconColor="indigo"
      />

      <StatCard
        icon={<ShieldAlert size={22} />}
        label="Total Deductions"
        value={formatCurrency(totalDeductions, currency)}
        description="PF & Professional Tax"
        iconColor="rose"
      />

      <StatCard
        icon={<Wallet size={22} />}
        label="Net Payable Salary"
        value={formatCurrency(netSalary, currency)}
        description="Authoritative take-home pay"
        iconColor="emerald"
      />
    </div>
  );
};
