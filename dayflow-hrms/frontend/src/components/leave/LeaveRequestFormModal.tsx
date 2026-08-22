import React, { useState, useEffect } from 'react';
import { LeaveType } from '../../types';
import { leaveService, CreateLeaveRequestParams } from '../../services/leaveService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { Textarea } from '../common/Textarea';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { CalendarPlus } from 'lucide-react';

export interface LeaveRequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeaveRequestFormModal: React.FC<LeaveRequestFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [leaveType, setLeaveType] = useState<LeaveType>('PAID');
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [remarks, setRemarks] = useState<string>('');
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Automatically calculate duration when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      s.setHours(0, 0, 0, 0);
      e.setHours(0, 0, 0, 0);

      if (e.getTime() >= s.getTime()) {
        const diffTime = e.getTime() - s.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setDuration(diffDays);
      } else {
        setDuration(0);
      }
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0) {
      showToast('End date cannot be before start date.', 'error');
      return;
    }
    setLoading(true);

    try {
      const payload: CreateLeaveRequestParams = {
        leaveType,
        startDate,
        endDate,
        remarks: remarks || undefined,
        attachmentUrl: attachmentUrl || undefined,
      };

      const res = await leaveService.createLeaveRequest(payload);
      if (res.success) {
        showToast('Leave request submitted successfully for approval.', 'success');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit leave request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Time Off / Leave"
      description="Submit a new leave application to your manager for approval."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Leave Type"
          required
          options={[
            { label: 'Paid Leave', value: 'PAID' },
            { label: 'Sick Leave', value: 'SICK' },
            { label: 'Unpaid Leave', value: 'UNPAID' },
          ]}
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Start Date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DatePicker
            label="End Date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
          <span className="text-indigo-700 font-semibold">Calculated Leave Duration:</span>
          <span className="font-extrabold font-mono text-indigo-900 text-sm">{duration} Day(s)</span>
        </div>

        <Textarea
          label="Reason / Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Briefly state the reason for your time off..."
          rows={3}
        />

        <Input
          label="Supporting Attachment URL (Optional)"
          value={attachmentUrl}
          onChange={(e) => setAttachmentUrl(e.target.value)}
          placeholder="https://docs.google.com/..."
          helperText="Attach medical certificate or supporting document URL if applicable."
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading} icon={<CalendarPlus size={16} />}>
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
