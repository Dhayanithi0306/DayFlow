import React from 'react';
import { Attendance } from '../../types';
import { formatDate, formatTime, formatMinutes } from '../../utils/formatters';
import { Table, Column } from '../common/Table';
import { Avatar } from '../common/Avatar';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { Button } from '../common/Button';
import { Edit } from 'lucide-react';

export interface AttendanceTableProps {
  data: Attendance[];
  loading?: boolean;
  isAdmin?: boolean;
  onEditRecord?: (record: Attendance) => void;
  pagination?: React.ReactNode;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  data,
  loading = false,
  isAdmin = false,
  onEditRecord,
  pagination,
}) => {
  const columns: Column<Attendance>[] = [
    ...(isAdmin
      ? [
          {
            key: 'employee',
            header: 'Employee',
            render: (row: Attendance) => {
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
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-mono text-xs font-semibold text-slate-900">{formatDate(row.date)}</span>,
    },
    {
      key: 'checkIn',
      header: 'Check In',
      render: (row) => <span className="font-mono text-xs text-slate-700">{formatTime(row.checkIn)}</span>,
    },
    {
      key: 'checkOut',
      header: 'Check Out',
      render: (row) => <span className="font-mono text-xs text-slate-700">{formatTime(row.checkOut)}</span>,
    },
    {
      key: 'workingHours',
      header: 'Working Hours',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-indigo-700">{formatMinutes(row.workingMinutes)}</span>
      ),
    },
    {
      key: 'extraHours',
      header: 'Extra Hours',
      render: (row) =>
        row.extraMinutes && row.extraMinutes > 0 ? (
          <span className="font-mono text-xs font-bold text-emerald-600">+{formatMinutes(row.extraMinutes)}</span>
        ) : (
          <span className="font-mono text-xs text-slate-400">0h 0m</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <AttendanceStatusBadge status={row.status} />,
    },
    ...(isAdmin
      ? [
          {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            render: (row: Attendance) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditRecord?.(row)}
                icon={<Edit size={14} />}
              >
                Adjust
              </Button>
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
      emptyMessage="No attendance records found."
      keyExtractor={(row) => row.id}
      pagination={pagination}
    />
  );
};
