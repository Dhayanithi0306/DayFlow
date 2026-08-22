import React from 'react';
import { PayrollRecord } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Table, Column } from '../common/Table';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Eye } from 'lucide-react';

export interface PayrollTableProps {
  data: PayrollRecord[];
  loading?: boolean;
  isAdmin?: boolean;
  onViewRecord?: (record: PayrollRecord) => void;
  pagination?: React.ReactNode;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  data,
  loading = false,
  isAdmin = false,
  onViewRecord,
  pagination,
}) => {
  const columns: Column<PayrollRecord>[] = [
    ...(isAdmin
      ? [
          {
            key: 'employee',
            header: 'Employee',
            render: (row: PayrollRecord) => {
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
      key: 'payPeriod',
      header: 'Pay Period',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-900">
          {formatDate(row.payPeriodStart)} – {formatDate(row.payPeriodEnd)}
        </span>
      ),
    },
    {
      key: 'grossSalary',
      header: 'Gross Salary',
      render: (row) => <span className="font-mono text-xs text-slate-800">{formatCurrency(row.grossSalary)}</span>,
    },
    {
      key: 'deductions',
      header: 'Deductions',
      render: (row) => <span className="font-mono text-xs text-rose-600">-{formatCurrency(row.totalDeductions)}</span>,
    },
    {
      key: 'netSalary',
      header: 'Net Salary',
      render: (row) => <span className="font-mono text-xs font-extrabold text-emerald-700">{formatCurrency(row.netSalary)}</span>,
    },
    {
      key: 'generatedAt',
      header: 'Generated Date',
      render: (row) => <span className="font-mono text-xs text-slate-500">{formatDate(row.generatedAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: PayrollRecord) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewRecord?.(row)}
          icon={<Eye size={14} />}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No payroll records found."
      keyExtractor={(row) => row.id}
      pagination={pagination}
    />
  );
};
