import React from 'react';
import type { Payroll } from '../../types/payroll';
import { FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface PayrollTableProps {
  payrollRecords: Payroll[];
  onViewSlip: (payroll: Payroll) => void;
  isLoading: boolean;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ payrollRecords, onViewSlip, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500">Loading payroll records...</p>
      </div>
    );
  }

  if (payrollRecords.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500">No payroll records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
          <tr>
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Month/Year</th>
            <th className="py-3 px-4">Gross Salary</th>
            <th className="py-3 px-4">Deductions</th>
            <th className="py-3 px-4">Net Salary</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payrollRecords.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{record.employeeName}</div>
                <div className="text-xs text-gray-500">{record.employeeId} - {record.department}</div>
              </td>
              <td className="py-3 px-4 text-gray-600">{record.month} {record.year}</td>
              <td className="py-3 px-4 text-gray-900">{formatCurrency(record.grossSalary)}</td>
              <td className="py-3 px-4 text-red-600">-{formatCurrency(record.structure.deductions + record.structure.tax)}</td>
              <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(record.netSalary)}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${record.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}
                  ${record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${record.status === 'Processed' ? 'bg-blue-100 text-blue-800' : ''}
                `}>
                  {record.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <button 
                  onClick={() => onViewSlip(record)}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium text-sm transition-colors"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  View Slip
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
