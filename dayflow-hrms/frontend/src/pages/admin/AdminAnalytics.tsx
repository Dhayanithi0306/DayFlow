import React, { useEffect, useState } from 'react';
import { analyticsService, AdminAnalyticsData } from '../../services/analyticsService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { LoadingState } from '../../components/common/LoadingState';
import { AttendanceTrendChart } from '../../components/analytics/AttendanceTrendChart';
import { LeaveDistributionChart } from '../../components/analytics/LeaveDistributionChart';
import { DepartmentAttendanceChart } from '../../components/analytics/DepartmentAttendanceChart';
import { PayrollSummaryChart } from '../../components/analytics/PayrollSummaryChart';
import { formatCurrency } from '../../utils/formatters';
import { Users, Clock, CalendarDays, Wallet } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsService.getAdminAnalytics();
      if (res.success && res.data?.analytics) {
        setData(res.data.analytics);
      }
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingState message="Loading administrative analytics dashboard..." />;
  }

  if (!data) return null;

  const { employeeStats, attendanceTrend, departmentAttendance, leaveStats, payrollStats, departmentPayroll } = data;

  const todayPresentTotal = departmentAttendance.reduce((acc: number, curr: { present: number }) => acc + curr.present, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative HR Analytics"
        subtitle="Visual statistics, attendance trends, leave allocations, and department payroll outflow."
      />

      {/* Key Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Users size={22} />}
          label="Total Active Headcount"
          value={employeeStats.activeEmployees}
          description={`${employeeStats.totalEmployees} total employee records`}
          iconColor="indigo"
        />

        <StatCard
          icon={<Clock size={22} />}
          label="Today's Present Rate"
          value={`${todayPresentTotal} Employees`}
          description="Live attendance recorded today"
          iconColor="emerald"
        />

        <StatCard
          icon={<CalendarDays size={22} />}
          label="Pending Leave Queue"
          value={`${leaveStats.pendingLeave} Requests`}
          description={`${leaveStats.approvedLeave} approved leave requests`}
          iconColor="amber"
        />

        <StatCard
          icon={<Wallet size={22} />}
          label="Monthly Net Payroll"
          value={formatCurrency(payrollStats.totalNetPayroll)}
          description={`${payrollStats.employeesWithSalary} active salary profiles`}
          iconColor="sky"
        />
      </div>

      {/* Grid Row 1: Attendance Trend Chart & Leave Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Attendance Trend (Past 7 Days)">
            <AttendanceTrendChart data={attendanceTrend} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card title="Leave Type Breakdown">
            <LeaveDistributionChart data={leaveStats.leaveTypeDistribution} />
          </Card>
        </div>
      </div>

      {/* Grid Row 2: Department Attendance & Department Payroll Outflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Department Attendance Breakdown (Today)">
          <DepartmentAttendanceChart data={departmentAttendance} />
        </Card>

        <Card title="Department Payroll Outflow Comparison">
          <PayrollSummaryChart data={departmentPayroll} />
        </Card>
      </div>
    </div>
  );
};
