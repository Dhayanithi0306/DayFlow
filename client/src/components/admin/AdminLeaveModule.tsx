import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Tabs } from '../common/Tabs';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { LeaveRequest, LeaveStatus } from '../../types/hrms';
import { CalendarDays, Check, X, MessageSquare, User, Filter } from 'lucide-react';

export const AdminLeaveModule: React.FC = () => {
  const { leaveRequests, updateLeaveStatus } = useHRMS();

  const [activeTab, setActiveTab] = useState<string>('Pending');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [adminComment, setAdminComment] = useState('');

  const pendingCount = leaveRequests.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaveRequests.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter((l) => l.status === 'Rejected').length;

  const tabItems = [
    { id: 'Pending', label: 'Pending Approvals', count: pendingCount },
    { id: 'Approved', label: 'Approved', count: approvedCount },
    { id: 'Rejected', label: 'Rejected', count: rejectedCount },
    { id: 'All', label: 'All Requests', count: leaveRequests.length },
  ];

  const filteredRequests = leaveRequests.filter((req) => {
    if (activeTab === 'All') return true;
    return req.status === activeTab;
  });

  const handleOpenReview = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setAdminComment(leave.adminComment || '');
    setIsReviewModalOpen(true);
  };

  const handleAction = (status: LeaveStatus) => {
    if (!selectedLeave) return;
    updateLeaveStatus(selectedLeave.id, status, adminComment);
    setIsReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Request Approvals Portal"
        subtitle="Review employee leave applications, write HR feedback comments, and approve or reject."
        breadcrumbs={[{ label: 'Management' }, { label: 'Leave Approvals' }]}
      />

      <Card>
        {/* Status Tabs */}
        <div className="mb-6">
          <Tabs tabs={tabItems} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Leave Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No leave requests found in this tab.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={leave.employeeAvatar} alt={leave.employeeName} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{leave.employeeName}</p>
                        <p className="text-[10px] text-slate-400">{leave.department}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{leave.leaveType}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {leave.startDate} to {leave.endDate}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{leave.days} d</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <Badge status={leave.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant={leave.status === 'Pending' ? 'primary' : 'outline'}
                        onClick={() => handleOpenReview(leave)}
                      >
                        {leave.status === 'Pending' ? 'Review Application' : 'View Details'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Modal */}
      {selectedLeave && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title={`Leave Review: ${selectedLeave.employeeName}`}
          subtitle={`${selectedLeave.leaveType} Leave • ${selectedLeave.days} Day(s)`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{selectedLeave.employeeName} ({selectedLeave.department})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Period:</span>
                <span className="font-bold text-slate-900">
                  {selectedLeave.startDate} to {selectedLeave.endDate} ({selectedLeave.days} days)
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-500 font-bold block mb-1">Stated Reason:</span>
                <p className="p-2 bg-white rounded-lg border border-slate-200 text-slate-800 italic">
                  "{selectedLeave.reason}"
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">HR Officer Comments / Feedback</label>
              <textarea
                rows={3}
                placeholder="Enter approval notes or reason for rejection..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setIsReviewModalOpen(false)}>
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  icon={<X className="h-4 w-4" />}
                  onClick={() => handleAction('Rejected')}
                >
                  Reject Request
                </Button>
                <Button
                  variant="success"
                  icon={<Check className="h-4 w-4" />}
                  onClick={() => handleAction('Approved')}
                >
                  Approve Request
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
