import React, { useEffect, useState } from 'react';
import { LeaveRequest, Department, LeaveStatus, LeaveType } from '../../types';
import { leaveService, LeaveSummaryData, LeaveQueryParams } from '../../services/leaveService';
import { employeeService } from '../../services/employeeService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { Pagination } from '../../components/common/Pagination';
import { LeaveTable } from '../../components/leave/LeaveTable';
import { LeaveApprovalModal } from '../../components/leave/LeaveApprovalModal';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const AdminTimeOff: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [summary, setSummary] = useState<LeaveSummaryData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Pagination state
  const [status, setStatus] = useState<string>('');
  const [leaveType, setLeaveType] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Approval Modal state
  const [selectedRecord, setSelectedRecord] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchSummary = async () => {
    try {
      const res = await leaveService.getAdminLeaveSummary();
      if (res.success && res.data?.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching admin leave summary:', err);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: LeaveQueryParams = {
        page,
        limit: 10,
        status: (status as LeaveStatus) || undefined,
        leaveType: (leaveType as LeaveType) || undefined,
        departmentId: departmentId || undefined,
      };

      const res = await leaveService.listAdminLeaveRequests(params);
      if (res.success && res.data) {
        setRequests(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching admin leave requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const loadDepartments = async () => {
      try {
        const res = await employeeService.listDepartments();
        if (res.success && res.data?.departments) setDepartments(res.data.departments);
      } catch (err) {
        console.error('Error loading departments:', err);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [page, status, leaveType, departmentId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Time Off Approvals"
        subtitle="Review, approve, or reject employee leave applications."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          icon={<Clock size={22} />}
          label="Pending Approvals"
          value={summary?.pendingCount ?? 0}
          description="Awaiting action"
          iconColor="amber"
        />

        <StatCard
          icon={<CheckCircle2 size={22} />}
          label="Approved Requests"
          value={summary?.approvedCount ?? 0}
          description="Granted leave"
          iconColor="emerald"
        />

        <StatCard
          icon={<XCircle size={22} />}
          label="Rejected Requests"
          value={summary?.rejectedCount ?? 0}
          description="Declined leave"
          iconColor="rose"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <FilterDropdown
          label="Status"
          value={status}
          onChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'PENDING', value: 'PENDING' },
            { label: 'APPROVED', value: 'APPROVED' },
            { label: 'REJECTED', value: 'REJECTED' },
          ]}
        />

        <FilterDropdown
          label="Leave Type"
          value={leaveType}
          onChange={(val) => {
            setLeaveType(val);
            setPage(1);
          }}
          options={[
            { label: 'All Leave Types', value: '' },
            { label: 'Paid Leave', value: 'PAID' },
            { label: 'Sick Leave', value: 'SICK' },
            { label: 'Unpaid Leave', value: 'UNPAID' },
          ]}
        />

        <FilterDropdown
          label="Department"
          value={departmentId}
          onChange={(val) => {
            setDepartmentId(val);
            setPage(1);
          }}
          options={[
            { label: 'All Departments', value: '' },
            ...departments.map((d) => ({ label: d.name, value: d.id })),
          ]}
        />
      </div>

      {/* Admin Leave Requests Table */}
      <LeaveTable
        data={requests}
        loading={loading}
        isAdmin={true}
        onApprove={(rec) => {
          setSelectedRecord(rec);
          setActionType('approve');
          setModalOpen(true);
        }}
        onReject={(rec) => {
          setSelectedRecord(rec);
          setActionType('reject');
          setModalOpen(true);
        }}
        pagination={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={10}
            onPageChange={setPage}
          />
        }
      />

      {/* Approval / Rejection Modal */}
      <LeaveApprovalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        record={selectedRecord}
        actionType={actionType}
        onSuccess={() => {
          fetchRequests();
          fetchSummary();
        }}
      />
    </div>
  );
};
