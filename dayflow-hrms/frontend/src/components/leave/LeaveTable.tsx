import React from 'react';
import { LeaveRequest } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Table, Column } from '../common/Table';
import { Avatar } from '../common/Avatar';
import { LeaveStatusBadge } from './LeaveStatusBadge';
import { Button } from '../common/Button';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface LeaveTableProps {
  data: LeaveRequest[];
  loading?: boolean;
  isAdmin?: boolean;
  onApprove?: (record: LeaveRequest) => void;
  onReject?: (record: LeaveRequest) => void;
  pagination?: React.ReactNode;
}

export const LeaveTable: React.FC<LeaveTableProps> = ({
  data,
  loading = false,
  isAdmin = false,
  onApprove,
  onReject,
  pagination,
}) => {
  const columns: Column<LeaveRequest>[] = [
    ...(isAdmin
      ? [
          {
            key: 'employee',
            header: 'Employee',
            render: (row: LeaveRequest) => {
              const emp = (row as any).employee;
              return emp ? (
                <div className="flex items-center gap-3">
                  <Avatar name={`${emp.firstName} ${emp.lastName}`} src={emp.profilePictureUrl} size="sm" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-[10px] text-indigo-700 font-mono">{emp.employeeId}</p>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400">N/A</span>
              );
            },
          },
        ]
      : []),
    {
      key: 'leaveType',
      header: 'Leave Type',
      render: (row) => (
        <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
          {row.leaveType === 'PAID' ? 'Paid Leave' : row.leaveType === 'SICK' ? 'Sick Leave' : 'Unpaid Leave'}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (row) => <span className="font-mono text-xs font-medium text-slate-900">{formatDate(row.startDate)}</span>,
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (row) => <span className="font-mono text-xs font-medium text-slate-900">{formatDate(row.endDate)}</span>,
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (row) => <span className="font-mono text-xs font-bold text-indigo-700">{row.duration} Days</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <LeaveStatusBadge status={row.status} />,
    },
    {
      key: 'reviewerComment',
      header: 'Reviewer Comment',
      render: (row) =>
        row.reviewerComment ? (
          <span className="text-xs text-slate-600 truncate max-w-xs block">{row.reviewerComment}</span>
        ) : (
          <span className="text-xs text-slate-400 italic">None</span>
        ),
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: LeaveRequest) =>
              row.status === 'PENDING' ? (
                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onApprove?.(row)}
                    icon={<CheckCircle2 size={14} />}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onReject?.(row)}
                    icon={<XCircle size={14} />}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 italic font-mono">Reviewed</span>
              ),
          },
        ]
      : []),
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No leave requests found."
      keyExtractor={(row) => row.id}
      pagination={pagination}
    />
  );
};
