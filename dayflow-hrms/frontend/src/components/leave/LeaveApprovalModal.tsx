import React, { useState } from 'react';
import { LeaveRequest } from '../../types';
import { leaveService } from '../../services/leaveService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/formatters';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface LeaveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LeaveRequest | null;
  actionType: 'approve' | 'reject';
  onSuccess: () => void;
}

export const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  isOpen,
  onClose,
  record,
  actionType,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;
    setLoading(true);

    try {
      if (actionType === 'approve') {
        const res = await leaveService.approveLeaveRequest(record.id, comment);
        if (res.success) {
          showToast('Leave request approved successfully.', 'success');
          onSuccess();
          onClose();
        }
      } else {
        const res = await leaveService.rejectLeaveRequest(record.id, comment);
        if (res.success) {
          showToast('Leave request rejected.', 'info');
          onSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || `Failed to ${actionType} leave request.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const empName = record && (record as any).employee
    ? `${(record as any).employee.firstName} ${(record as any).employee.lastName}`
    : 'Employee';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request — ${empName}`}
      description="Review application details and provide reviewer comments."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {record && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Leave Type:</span>
              <span className="font-bold text-slate-800 uppercase">{record.leaveType} LEAVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date Range:</span>
              <span className="font-semibold text-slate-900">{formatDate(record.startDate)} → {formatDate(record.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Duration:</span>
              <span className="font-extrabold font-mono text-indigo-700">{record.duration} Days</span>
            </div>
            {record.remarks && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block mb-0.5">Employee Remarks:</span>
                <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-200">{record.remarks}</p>
              </div>
            )}
          </div>
        )}

        <Textarea
          label="Reviewer Comment / Feedback"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            actionType === 'approve'
              ? 'e.g. Approved. Please hand over active tasks before departure.'
              : 'e.g. Rejected due to critical project deadline.'
          }
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'approve' ? 'success' : 'danger'}
            size="sm"
            type="submit"
            loading={loading}
            icon={actionType === 'approve' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          >
            {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
