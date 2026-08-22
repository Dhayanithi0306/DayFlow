import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeDashboardData } from '../../types';
import { dashboardService } from '../../services/dashboardService';
import { attendanceService } from '../../services/attendanceService';
import { PageHeader } from '../../components/common/PageHeader';
import { CheckInCard } from '../../components/attendance/CheckInCard';
import { LeaveBalanceCards } from '../../components/leave/LeaveBalanceCards';
import { SalarySummaryCard } from '../../components/payroll/SalarySummaryCard';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { LoadingState } from '../../components/common/LoadingState';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  User,
  Clock,
  CalendarDays,
  Wallet,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getEmployeeDashboard();
      if (res.success && res.data?.dashboard) {
        setData(res.data.dashboard);
      }
    } catch (err) {
      console.error('Error fetching employee dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      await attendanceService.checkIn();
      await fetchDashboard();
    } catch (err) {
      console.error('Check in error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await attendanceService.checkOut();
      await fetchDashboard();
    } catch (err) {
      console.error('Check out error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return <LoadingState message="Loading your HRMS dashboard..." />;
  }

  if (!data) return null;

  const { employee, todayAttendance, attendanceSummary, leaveBalances, upcomingLeave, salaryInfo, recentPayroll } = data;

  return (
    <div className="space-y-6">
      {/* Dynamic Welcome Header */}
      <PageHeader
        title={`${getGreeting()}, ${employee.firstName}!`}
        subtitle="Here is your personal HR portal overview and workday summary."
      />

      {/* Employee Identity Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar
            name={`${employee.firstName} ${employee.lastName}`}
            src={employee.profilePictureUrl}
            size="xl"
            className="ring-4 ring-white/20"
          />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-xs text-indigo-200 font-medium">{employee.designation} • {employee.departmentName}</p>
            <p className="text-[11px] font-mono text-indigo-300 mt-1">ID: {employee.employeeId}</p>
          </div>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => navigate('/employee/profile')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <User size={15} /> Profile
          </button>
          <button
            onClick={() => navigate('/employee/attendance')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Clock size={15} /> Attendance
          </button>
          <button
            onClick={() => navigate('/employee/time-off')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarDays size={15} /> Apply Leave
          </button>
          <button
            onClick={() => navigate('/employee/payroll')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Wallet size={15} /> Payslips
          </button>
        </div>
      </div>

      {/* Grid Row 1: Today's Attendance & Monthly Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CheckInCard
            todayAttendance={todayAttendance}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            loading={actionLoading}
          />
        </div>

        <div className="lg:col-span-2">
          <Card title="Monthly Attendance Summary">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <CheckCircle2 size={24} className="text-emerald-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-medium block">Present</span>
                <span className="text-2xl font-extrabold text-emerald-700 font-mono">
                  {attendanceSummary?.presentCount ?? 0} Days
                </span>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                <XCircle size={24} className="text-rose-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-medium block">Absent</span>
                <span className="text-2xl font-extrabold text-rose-700 font-mono">
                  {attendanceSummary?.absentCount ?? 0} Days
                </span>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <AlertCircle size={24} className="text-amber-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-medium block">Half Day</span>
                <span className="text-2xl font-extrabold text-amber-700 font-mono">
                  {attendanceSummary?.halfDayCount ?? 0} Days
                </span>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <CalendarCheck size={24} className="text-indigo-600 mx-auto mb-1" />
                <span className="text-xs text-slate-500 font-medium block">On Leave</span>
                <span className="text-2xl font-extrabold text-indigo-700 font-mono">
                  {attendanceSummary?.leaveCount ?? 0} Days
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Grid Row 2: Leave Balances */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Time Off Allocations</h3>
        <LeaveBalanceCards balances={leaveBalances} />
      </div>

      {/* Grid Row 3: Salary Summary & Upcoming Approved Leave */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Current Take-Home Salary</h3>
          {salaryInfo ? (
            <SalarySummaryCard
              grossSalary={salaryInfo.grossSalary}
              totalDeductions={salaryInfo.totalDeductions}
              netSalary={salaryInfo.netSalary}
            />
          ) : (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              No active salary structure configured yet.
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card title="Upcoming Approved Leave">
            {upcomingLeave.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No upcoming approved leave scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcomingLeave.map((l) => (
                  <div key={l.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-900">
                      <span className="uppercase text-indigo-700">{l.leaveType} LEAVE</span>
                      <span className="font-mono text-indigo-900">{l.duration} Days</span>
                    </div>
                    <p className="text-slate-500 font-mono text-[11px]">
                      {formatDate(l.startDate)} → {formatDate(l.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Grid Row 4: Recent Payroll Snapshot */}
      {recentPayroll && (
        <Card title="Latest Payroll Statement">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  Pay Period: {formatDate(recentPayroll.payPeriodStart)} – {formatDate(recentPayroll.payPeriodEnd)}
                </p>
                <p className="text-slate-500">Generated on {formatDate(recentPayroll.generatedAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Net Salary</span>
              <span className="text-base font-extrabold text-emerald-700 font-mono">
                {formatCurrency(recentPayroll.netSalary)}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
