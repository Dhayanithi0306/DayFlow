import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import type { LeaveType } from '../../types/hrms';
import { CalendarDays, Plus, MessageSquare, Palmtree, Stethoscope, AlertTriangle } from 'lucide-react';

export const EmployeeLeave: React.FC = () => {
  const { currentUser, leaveRequests, applyLeaveRequest } = useHRMS();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [leaveType, setLeaveType] = useState<LeaveType>('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const userLeaves = leaveRequests.filter((l) => l.employeeId === currentUser?.employeeId);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    applyLeaveRequest({
      leaveType,
      startDate,
      endDate,
      days: calculateDays(),
      reason,
    });

    setStartDate('');
    setEndDate('');
    setReason('');
    setIsApplyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle="Check leave balances, submit requests for paid, sick, or unpaid leave, and view status."
        breadcrumbs={[{ label: 'Self Service' }, { label: 'Leave' }]}
        action={
          <Button
            variant="primary"
            onClick={() => setIsApplyModalOpen(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Apply for Leave
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Paid Leave</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{currentUser?.leaveBalance.paid || 14}</span>
              <span className="text-xs text-slate-500">/ 20 days left</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Palmtree className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sick Leave</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{currentUser?.leaveBalance.sick || 8}</span>
              <span className="text-xs text-slate-500">/ 12 days left</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Stethoscope className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unpaid Leave</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{currentUser?.leaveBalance.unpaid || 0}</span>
              <span className="text-xs text-slate-500">days taken</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      <Card title="My Leave Request History">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">HR Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    You haven't submitted any leave requests yet.
                  </td>
                </tr>
              ) : (
                userLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                      {leave.leaveType} Leave
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{leave.startDate}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{leave.endDate}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{leave.days} d</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3.5 px-4">
                      <Badge status={leave.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {leave.adminComment ? (
                        <div className="flex items-center gap-1 text-indigo-700 font-medium">
                          <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                          <span>{leave.adminComment}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Leave Application"
        subtitle="Fill out the details for HR review."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Leave Category</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
            >
              <option value="Paid">Paid Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {startDate && endDate && (
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-900 font-semibold flex items-center justify-between">
              <span>Total Duration:</span>
              <span className="font-extrabold text-sm">{calculateDays()} Working Day(s)</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reason for Absence</label>
            <textarea
              rows={3}
              required
              placeholder="Provide context for your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
