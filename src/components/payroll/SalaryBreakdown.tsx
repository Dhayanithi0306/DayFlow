import React from 'react';
import type { SalaryStructure } from '../../types/payroll';
import { formatCurrency } from '../../utils/formatCurrency';

interface SalaryBreakdownProps {
  structure: SalaryStructure;
}

export const SalaryBreakdown: React.FC<SalaryBreakdownProps> = ({ structure }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Salary Structure</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Basic Salary</span>
          <span className="font-medium text-gray-900">{formatCurrency(structure.basicSalary)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">House Rent Allowance (HRA)</span>
          <span className="font-medium text-gray-900">{formatCurrency(structure.hra)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Other Allowances</span>
          <span className="font-medium text-gray-900">{formatCurrency(structure.allowances)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Bonus</span>
          <span className="font-medium text-gray-900">{formatCurrency(structure.bonus)}</span>
        </div>
        <div className="border-t border-gray-100 my-2 pt-2"></div>
        <div className="flex justify-between items-center text-red-600">
          <span>Deductions</span>
          <span>-{formatCurrency(structure.deductions)}</span>
        </div>
        <div className="flex justify-between items-center text-red-600">
          <span>Tax</span>
          <span>-{formatCurrency(structure.tax)}</span>
        </div>
      </div>
    </div>
  );
};
