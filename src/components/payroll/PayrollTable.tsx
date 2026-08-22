import React from 'react';
import type { Payroll } from '../../types/payroll';
import { Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

interface PayrollTableProps {
  payrollRecords: Payroll[];
  isLoading: boolean;
  onViewSlip: (payroll: Payroll) => void;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({ payrollRecords, isLoading, onViewSlip }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (payrollRecords.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
        <p className="font-medium text-sm">No payroll records found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-white">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Employee
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              System Login ID
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Net Pay
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {payrollRecords.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                    {record.employeeName.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-gray-900">{record.employeeName}</div>
                    <div className="text-xs text-gray-400 font-medium">{record.employeeName.toLowerCase().replace(' ', '.')}@dayflow.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-xs font-bold text-violet-600">{record.employeeId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-gray-900">{formatCurrency(record.netSalary)}</div>
                <div className="text-xs text-gray-400 font-medium">For {record.month} {record.year}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {record.status === 'Paid' ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pending
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewSlip(record)}
                  className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors font-bold text-xs"
                >
                  <Eye className="h-4 w-4 mr-1" />
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
