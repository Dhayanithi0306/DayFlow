import React, { useState } from 'react';
import { payrollService, GeneratePayrollParams } from '../../services/payrollService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { DatePicker } from '../common/DatePicker';
import { Button } from '../common/Button';
import { Play } from 'lucide-react';

export interface GeneratePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GeneratePayrollModal: React.FC<GeneratePayrollModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [payPeriodStart, setPayPeriodStart] = useState<string>('2026-08-01');
  const [payPeriodEnd, setPayPeriodEnd] = useState<string>('2026-08-31');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: GeneratePayrollParams = {
        payPeriodStart,
        payPeriodEnd,
      };

      const res = await payrollService.generatePayrollRecords(payload);
      if (res.success && res.data) {
        showToast(res.message || 'Payroll generation process completed.', 'success');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Payroll generation failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Monthly Payroll Records"
      description="Calculate and generate historical payroll snapshots for active company employees."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Pay Period Start"
            required
            value={payPeriodStart}
            onChange={(e) => setPayPeriodStart(e.target.value)}
          />
          <DatePicker
            label="Pay Period End"
            required
            value={payPeriodEnd}
            onChange={(e) => setPayPeriodEnd(e.target.value)}
          />
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">Generation Workflow:</p>
          <p>• Queries active salary structure for each employee.</p>
          <p>• Integrates attendance & approved leave counts in date range.</p>
          <p>• Prevents duplicate payroll generation for same period.</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading} icon={<Play size={16} />}>
            Run Payroll Generation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
