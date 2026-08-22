import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { StatCard } from '../common/StatCard';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CheckInWidget } from '../attendance/CheckInWidget';
import {
  CalendarCheck,
  CalendarDays,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Palmtree,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, leaveRequests, attendanceRecords } = useHRMS();

  const userLeaves = leaveRequests.filter((l) => l.employeeId === currentUser?.employeeId);
  const userAttendance = attendanceRecords.filter((a) => a.employeeId === currentUser?.employeeId);

  const presentCount = userAttendance.filter((a) => a.status === 'Present').length;
  const attendancePercentage = userAttendance.length > 0 ? Math.round((presentCount / userAttendance.length) * 100) : 95;

  const netPay = currentUser?.salaryStructure?.netSalary ?? currentUser?.netSalary ?? 7800;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 p-6 text-white shadow-lg shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Employee Self-Service Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {currentUser?.name}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
              {currentUser?.designation} • {currentUser?.department} • ID: {currentUser?.loginId || 'DAYSJ20230001'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('leave')}
              icon={<CalendarDays className="h-4 w-4 text-indigo-600" />}
            >
              Apply Leave
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-white text-indigo-700 hover:bg-indigo-50 border-0 shadow-md"
              onClick={() => onNavigateTab('attendance')}
            >
              Attendance Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Clock-In Widget & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CheckInWidget />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Monthly Attendance"
            value={`${attendancePercentage}%`}
            change="2.4%"
            isPositive={true}
            icon={<CalendarCheck className="h-5 w-5" />}
            iconBgColor="bg-emerald-50"
            iconColor="text-emerald-600"
            subtext={`${presentCount} days present`}
          />

          <StatCard
            title="Paid Leave Balance"
            value={`${currentUser?.leaveBalance.paid || 14} Days`}
            icon={<Palmtree className="h-5 w-5" />}
            iconBgColor="bg-cyan-50"
            iconColor="text-cyan-600"
            subtext="Available for booking"
          />

          <StatCard
            title="Monthly Net Salary"
            value={`$${netPay.toLocaleString()}`}
            change="Read-only"
            isPositive={true}
            icon={<DollarSign className="h-5 w-5" />}
            iconBgColor="bg-indigo-50"
            iconColor="text-indigo-600"
            subtext="Scheduled direct deposit"
          />

          <StatCard
            title="Sick Leave Remaining"
            value={`${currentUser?.leaveBalance.sick || 8} Days`}
            icon={<TrendingUp className="h-5 w-5" />}
            iconBgColor="bg-amber-50"
            iconColor="text-amber-600"
            subtext="Sick leave quota"
          />
        </div>
      </div>

      {/* Recent Leaves Table Card */}
      <Card
        title="Recent Leave Requests"
        action={
          <button
            onClick={() => onNavigateTab('leave')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        {userLeaves.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No recent leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Dates</th>
                  <th className="py-2.5 px-3">Days</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Applied On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userLeaves.slice(0, 4).map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-semibold text-slate-900">{l.leaveType} Leave</td>
                    <td className="py-3 px-3 text-slate-600">
                      {l.startDate} to {l.endDate}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{l.days}d</td>
                    <td className="py-3 px-3">
                      <Badge status={l.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">{l.appliedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
