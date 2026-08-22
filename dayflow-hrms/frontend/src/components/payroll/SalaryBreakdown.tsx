import React from 'react';
import { ComputedSalaryTotals, SalaryStructure } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface SalaryBreakdownProps {
  structure?: SalaryStructure | null;
  computed?: ComputedSalaryTotals | null;
  currency?: string;
}

export const SalaryBreakdown: React.FC<SalaryBreakdownProps> = ({
  structure,
  computed,
  currency = 'INR',
}) => {
  if (!structure || !computed) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Earnings Column */}
      <Card
        title="Itemized Earnings"
        action={
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp size={16} /> Total: {formatCurrency(computed.grossSalary, currency)}
          </span>
        }
      >
        <dl className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">Basic Salary</dt>
            <dd className="font-semibold text-slate-900 font-mono">{formatCurrency(computed.basicSalary, currency)}</dd>
          </div>
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">House Rent Allowance (HRA)</dt>
            <dd className="font-semibold text-slate-900 font-mono">{formatCurrency(computed.hra, currency)}</dd>
          </div>
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">Standard Allowance</dt>
            <dd className="font-semibold text-slate-900 font-mono">{formatCurrency(computed.standardAllowance, currency)}</dd>
          </div>
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">Performance Bonus</dt>
            <dd className="font-semibold text-slate-900 font-mono">{formatCurrency(computed.performanceBonus, currency)}</dd>
          </div>
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">Leave Travel Allowance (LTA)</dt>
            <dd className="font-semibold text-slate-900 font-mono">{formatCurrency(computed.leaveTravelAllowance, currency)}</dd>
          </div>
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">Fixed Allowance</dt>
            <dd className="font-semibold text-slate-900 font-mono">{formatCurrency(computed.fixedAllowance, currency)}</dd>
          </div>
        </dl>
      </Card>

      {/* Deductions Column */}
      <Card
        title="Itemized Deductions"
        action={
          <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
            <TrendingDown size={16} /> Total: {formatCurrency(computed.totalDeductions, currency)}
          </span>
        }
      >
        <dl className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">Provident Fund (PF)</dt>
            <dd className="font-semibold text-rose-600 font-mono">{formatCurrency(computed.providentFund, currency)}</dd>
          </div>
          <div className="py-2.5 flex justify-between">
            <dt className="text-slate-500">Professional Tax</dt>
            <dd className="font-semibold text-rose-600 font-mono">{formatCurrency(computed.professionalTax, currency)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
};
