import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardData } from '../../types';
import { dashboardService } from '../../services/dashboardService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Table, Column } from '../../components/common/Table';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  Users,
  Clock,
  CalendarDays,
  Wallet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getAdminDashboard();
      if (res.success && res.data?.dashboard) {
        setData(res.data.dashboard);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Loading organization HR metrics..." />;
  }

  if (!data) return null;

  const { totalActiveEmployees, todayAttendance, pendingLeavesCount, payrollSummary, recentAuditLogs } = data;

  const auditColumns: Column<any>[] = [
    {
      key: 'createdAt',
      header: 'Timestamp',
      render: (row) => <span className="font-mono text-xs text-slate-500">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-indigo-700 uppercase">{row.action}</span>
      ),
    },
    {
      key: 'user',
      header: 'Performed By',
      render: (row) => {
        const emp = row.user?.employee;
        return (
          <span className="text-xs font-medium text-slate-800">
            {emp ? `${emp.firstName} ${emp.lastName}` : row.user?.email || 'System'}
          </span>
        );
      },
    },
    {
      key: 'description',
      header: 'Details',
      render: (row) => <span className="text-xs text-slate-600 truncate max-w-sm block">{row.description}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization HR Dashboard"
        subtitle="Real-time company metrics, daily attendance, leave queues, and administrative logs."
      />

      {/* Primary HR Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Users size={22} />}
          label="Total Active Headcount"
          value={totalActiveEmployees}
          description="Active company employees"
          iconColor="indigo"
        />

        <StatCard
          icon={<Clock size={22} />}
          label="Today's Present"
          value={todayAttendance.presentCount}
          description={`${todayAttendance.absentCount} absent / ${todayAttendance.leaveCount} on leave`}
          iconColor="emerald"
        />

        <div onClick={() => navigate('/admin/time-off')} className="cursor-pointer">
          <StatCard
            icon={<CalendarDays size={22} />}
            label="Pending Leave Requests"
            value={pendingLeavesCount}
            description="Click to review queue"
            iconColor="amber"
          />
        </div>

        <StatCard
          icon={<Wallet size={22} />}
          label="Total Company Net Payroll"
          value={formatCurrency(payrollSummary.totalNetPayroll)}
          description={`${payrollSummary.employeesWithSalary} active salary profiles`}
          iconColor="sky"
        />
      </div>

      {/* Today's Attendance Overview */}
      <Card title="Today's Attendance Status Breakdown">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <CheckCircle2 size={24} className="text-emerald-600 mx-auto mb-1" />
            <span className="text-xs text-slate-500 font-medium block">Present</span>
            <span className="text-2xl font-extrabold text-emerald-700 font-mono">
              {todayAttendance.presentCount}
            </span>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
            <XCircle size={24} className="text-rose-600 mx-auto mb-1" />
            <span className="text-xs text-slate-500 font-medium block">Absent</span>
            <span className="text-2xl font-extrabold text-rose-700 font-mono">
              {todayAttendance.absentCount}
            </span>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <AlertCircle size={24} className="text-amber-600 mx-auto mb-1" />
            <span className="text-xs text-slate-500 font-medium block">Half Day</span>
            <span className="text-2xl font-extrabold text-amber-700 font-mono">
              {todayAttendance.halfDayCount}
            </span>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <CalendarCheck size={24} className="text-indigo-600 mx-auto mb-1" />
            <span className="text-xs text-slate-500 font-medium block">On Leave</span>
            <span className="text-2xl font-extrabold text-indigo-700 font-mono">
              {todayAttendance.leaveCount}
            </span>
          </div>
        </div>
      </Card>

      {/* Quick Administrative Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin/employees')}
          className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group"
        >
          <div>
            <p className="text-xs font-bold text-slate-900">Manage Employees</p>
            <p className="text-[11px] text-slate-400">Directory & status</p>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button
          onClick={() => navigate('/admin/attendance')}
          className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group"
        >
          <div>
            <p className="text-xs font-bold text-slate-900">Attendance Portal</p>
            <p className="text-[11px] text-slate-400">Monitor & corrections</p>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button
          onClick={() => navigate('/admin/time-off')}
          className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group"
        >
          <div>
            <p className="text-xs font-bold text-slate-900">Time Off Queue</p>
            <p className="text-[11px] text-slate-400">Approve leave applications</p>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button
          onClick={() => navigate('/admin/payroll')}
          className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between text-left cursor-pointer group"
        >
          <div>
            <p className="text-xs font-bold text-slate-900">Payroll Management</p>
            <p className="text-[11px] text-slate-400">Salary structure & run</p>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>
      </div>

      {/* Recent System Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600" /> Recent Administrative Activity Log
          </h3>
        </div>

        <Table
          columns={auditColumns}
          data={recentAuditLogs}
          emptyMessage="No administrative audit logs recorded yet."
          keyExtractor={(row) => row.id}
        />
      </div>
    </div>
  );
};
