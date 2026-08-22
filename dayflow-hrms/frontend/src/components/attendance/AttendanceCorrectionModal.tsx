import React, { useEffect, useState } from 'react';
import { Attendance, AttendanceStatus } from '../../types';
import { attendanceService, AdminUpdateAttendanceParams } from '../../services/attendanceService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';

export interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Attendance | null;
  onSuccess: () => void;
}

export const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  isOpen,
  onClose,
  record,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [status, setStatus] = useState<AttendanceStatus>('PRESENT');
  const [remarks, setRemarks] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (record) {
      // Format to datetime-local string (YYYY-MM-THH:mm)
      setCheckIn(record.checkIn ? new Date(record.checkIn).toISOString().slice(0, 16) : '');
      setCheckOut(record.checkOut ? new Date(record.checkOut).toISOString().slice(0, 16) : '');
      setStatus(record.status);
      setRemarks(record.remarks || '');
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;
    setLoading(true);

    try {
      const payload: AdminUpdateAttendanceParams = {
        checkIn: checkIn ? new Date(checkIn).toISOString() : undefined,
        checkOut: checkOut ? new Date(checkOut).toISOString() : undefined,
        status,
        remarks: remarks || undefined,
      };

      const res = await attendanceService.updateAttendance(record.id, payload);
      if (res.success) {
        showToast('Attendance record adjusted and recalculated successfully.', 'success');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update attendance.', 'error');
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
      title={`Admin Attendance Adjustment — ${empName}`}
      description={`Adjust recorded check-in/out timestamps for ${new Date(record?.date || Date.now()).toLocaleDateString()}.`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Check-in Timestamp"
            type="datetime-local"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <Input
            label="Check-out Timestamp"
            type="datetime-local"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <Select
          label="Attendance Status"
          options={[
            { label: 'PRESENT', value: 'PRESENT' },
            { label: 'HALF_DAY', value: 'HALF_DAY' },
            { label: 'ABSENT', value: 'ABSENT' },
            { label: 'LEAVE', value: 'LEAVE' },
          ]}
          value={status}
          onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
        />

        <Textarea
          label="Adjustment Reason / Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="e.g. Employee forgot to clock out at shift end."
          rows={2}
        />

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <span>
            Working hours and overtime extra minutes will be recalculated automatically by the backend upon saving. An audit log entry will be created.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading}>
            Save Adjustment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
