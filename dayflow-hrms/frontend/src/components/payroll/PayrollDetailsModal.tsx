import React from 'react';
import { PayrollRecord } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Calendar, FileText } from 'lucide-react';

export interface PayrollDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
}

export const PayrollDetailsModal: React.FC<PayrollDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!record) return null;

  const empName = (record as any).employee
    ? `${(record as any).employee.firstName} ${(record as any).employee.lastName}`
    : 'Employee';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payroll Statement — ${empName}`}
      description={`Pay period ${formatDate(record.payPeriodStart)} to ${formatDate(record.payPeriodEnd)}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Attendance Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Working Days</span>
            <span className="text-base font-bold font-mono text-slate-900">{record.workingDays}</span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <span className="text-emerald-600 block text-[10px] uppercase font-semibold">Present Days</span>
            <span className="text-base font-bold font-mono text-emerald-800">{record.presentDays}</span>
          </div>
          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl">
            <span className="text-sky-600 block text-[10px] uppercase font-semibold">Leave Days</span>
            <span className="text-base font-bold font-mono text-sky-800">{record.leaveDays}</span>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
            <span className="text-rose-600 block text-[10px] uppercase font-semibold">Absent Days</span>
            <span className="text-base font-bold font-mono text-rose-800">{record.absentDays}</span>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Gross Monthly Salary</span>
            <span className="font-bold text-slate-900 font-mono">{formatCurrency(record.grossSalary)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Total Deductions (PF & Tax)</span>
            <span className="font-bold text-rose-600 font-mono">-{formatCurrency(record.totalDeductions)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm font-extrabold text-indigo-900 bg-indigo-50 p-2 rounded-xl border border-indigo-100">
            <span>Net Take-Home Pay</span>
            <span className="font-mono">{formatCurrency(record.netSalary)}</span>
          </div>
        </div>

        {/* Payslip Document Status */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-indigo-600" />
            <div>
              <p className="font-semibold text-slate-800">Payslip PDF Document</p>
              <p className="text-[11px] text-slate-400">
                {record.payslip ? 'Payslip available' : 'No payslip PDF generated yet.'}
              </p>
            </div>
          </div>
          {record.payslip?.fileUrl ? (
            <a
              href={record.payslip.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Download PDF
            </a>
          ) : (
            <span className="text-[10px] text-slate-400 italic">Not Generated</span>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
