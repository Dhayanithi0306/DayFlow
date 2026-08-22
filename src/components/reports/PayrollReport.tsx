import React from 'react';
import type { PayrollSummary } from '../../types/payroll';
import { formatCurrency } from '../../utils/formatCurrency';

interface PayrollReportProps {
  summary: PayrollSummary | null;
  isLoading: boolean;
}

export const PayrollReport: React.FC<PayrollReportProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return <div className="p-4 bg-white rounded shadow-sm border border-gray-100 text-gray-500">Loading Payroll Report...</div>;
  }

  if (!summary) {
    return <div className="p-4 bg-white rounded shadow-sm border border-gray-100 text-gray-500">No payroll data available for this period.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Net Salary Paid</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalNetSalary)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Gross Salary</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(summary.totalGrossSalary)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Deductions</div>
          <div className="text-xl font-bold text-red-600">{formatCurrency(summary.totalDeductions)}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Employees Paid</div>
          <div className="text-xl font-bold text-gray-900">{summary.totalEmployeesPaid}</div>
        </div>
      </div>
    </div>
  );
};
