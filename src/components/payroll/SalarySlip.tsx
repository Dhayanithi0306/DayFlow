import React from 'react';
import type { Payroll } from '../../types/payroll';
import { formatCurrency } from '../../utils/formatCurrency';
import { Printer } from 'lucide-react';

interface SalarySlipProps {
  payroll: Payroll;
}

export const SalarySlip: React.FC<SalarySlipProps> = ({ payroll }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 max-w-3xl mx-auto overflow-hidden">
      {/* Action Bar (Hidden when printing) */}
      <div className="flex justify-end p-4 border-b border-gray-100 bg-gray-50 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Slip
        </button>
      </div>

      {/* Slip Content */}
      <div className="p-8 print:p-0 bg-white" id="printable-salary-slip">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dayflow</h1>
          <p className="text-gray-500 mt-1">Human Resource Management System</p>
          <div className="mt-6 border-b border-gray-200"></div>
          <h2 className="text-lg font-semibold text-gray-800 mt-4 uppercase tracking-wider">
            Salary Slip - {payroll.month} {payroll.year}
          </h2>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Employee Name:</span>
              <span className="font-medium text-gray-900">{payroll.employeeName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 mt-2">
              <span className="text-gray-500">Employee ID:</span>
              <span className="font-medium text-gray-900">{payroll.employeeId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 mt-2">
              <span className="text-gray-500">Department:</span>
              <span className="font-medium text-gray-900">{payroll.department}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-500">Designation:</span>
              <span className="font-medium text-gray-900">{payroll.designation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 mt-2">
              <span className="text-gray-500">Pay Period:</span>
              <span className="font-medium text-gray-900">{payroll.month} {payroll.year}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100 mt-2">
              <span className="text-gray-500">Payment Status:</span>
              <span className="font-medium text-gray-900">{payroll.status}</span>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          {/* Earnings */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 border-b border-gray-300 pb-1">Earnings</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Salary</span>
                <span className="text-gray-900">{formatCurrency(payroll.structure.basicSalary)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HRA</span>
                <span className="text-gray-900">{formatCurrency(payroll.structure.hra)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allowances</span>
                <span className="text-gray-900">{formatCurrency(payroll.structure.allowances)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus</span>
                <span className="text-gray-900">{formatCurrency(payroll.structure.bonus)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 border-b border-gray-300 pb-1">Deductions</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Provident Fund / Deductions</span>
                <span className="text-gray-900">{formatCurrency(payroll.structure.deductions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (TDS)</span>
                <span className="text-gray-900">{formatCurrency(payroll.structure.tax)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm font-semibold">
          <div className="flex justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-700">Gross Earnings</span>
            <span className="text-gray-900">{formatCurrency(payroll.grossSalary)}</span>
          </div>
          <div className="flex justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-700">Total Deductions</span>
            <span className="text-gray-900">{formatCurrency(payroll.structure.deductions + payroll.structure.tax)}</span>
          </div>
        </div>

        {/* Net Salary Highlight */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5 flex items-center justify-between">
          <span className="text-indigo-900 text-lg font-semibold">Net Salary Payable</span>
          <span className="text-indigo-700 text-2xl font-bold">{formatCurrency(payroll.netSalary)}</span>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-400">
          <p>This is a computer generated document and requires no signature.</p>
        </div>
      </div>
    </div>
  );
};
