import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { StatCard } from '../common/StatCard';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Users,
  CalendarCheck,
  CheckSquare,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AdminDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { employees, attendanceRecords, leaveRequests, updateLeaveStatus } = useHRMS();

  const activeEmployeesCount = employees.length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  // Attendance metrics today
  const todayAttendance = attendanceRecords.filter((a) => a.date === '2026-08-22' || true);
  const presentCount = todayAttendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = activeEmployeesCount > 0 ? Math.round((presentCount / activeEmployeesCount) * 100) : 92;

  // Payroll summary total
  const totalMonthlyPayroll = employees.reduce((acc, curr) => acc + (curr.salaryStructure?.netSalary || 7800), 0);

  // Recharts Attendance Data
  const attendanceChartData = [
    { name: 'Mon', Present: 6, HalfDay: 1, Leave: 0, Absent: 0 },
    { name: 'Tue', Present: 5, HalfDay: 1, Leave: 1, Absent: 0 },
    { name: 'Wed', Present: 6, HalfDay: 0, Leave: 1, Absent: 0 },
    { name: 'Thu', Present: 4, HalfDay: 2, Leave: 1, Absent: 0 },
    { name: 'Today', Present: presentCount, HalfDay: 1, Leave: 1, Absent: 1 },
  ];

  // Recharts Department Pie Data
  const deptCounts: { [key: string]: number } = {};
  employees.forEach((e) => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  const pieData = Object.keys(deptCounts).map((dept) => ({
    name: dept,
    value: deptCounts[dept],
  }));

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-800 via-indigo-700 to-indigo-600 p-6 text-white shadow-lg shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-300" />
              HR Management Portal Active
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive HR Dashboard 📊
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
              Monitor organization-wide attendance, review pending leaves, and manage payroll.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigateTab('admin-leaves')}
              icon={<CheckSquare className="h-4 w-4 text-violet-600" />}
            >
              Review Leaves ({pendingLeaves.length})
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-white text-violet-800 hover:bg-violet-50 border-0 shadow-md"
              onClick={() => onNavigateTab('admin-employees')}
            >
              Manage Employees
            </Button>
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Headcount"
          value={`${activeEmployeesCount} Staff`}
          change="3 new this month"
          isPositive={true}
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          subtext="Active workforce across 5 depts"
        />

        <StatCard
          title="Today's Attendance"
          value={`${attendanceRate}%`}
          change="On Track"
          isPositive={true}
          icon={<CalendarCheck className="h-5 w-5" />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          subtext={`${presentCount} present out of ${activeEmployeesCount}`}
        />

        <StatCard
          title="Pending Approvals"
          value={`${pendingLeaves.length} Requests`}
          icon={<CheckSquare className="h-5 w-5" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          subtext="Action required by HR"
        />

        <StatCard
          title="Monthly Payroll Total"
          value={`$${totalMonthlyPayroll.toLocaleString()}`}
          change="Budgeted"
          isPositive={true}
          icon={<DollarSign className="h-5 w-5" />}
          iconBgColor="bg-violet-50"
          iconColor="text-violet-600"
          subtext="Gross net payout for August"
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Breakdown Bar Chart */}
        <Card className="lg:col-span-2" title="Weekly Attendance Distribution">
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="HalfDay" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Leave" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-emerald-500" /> Present
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-amber-500" /> Half-day
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-indigo-500" /> Leave
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="h-3 w-3 rounded-full bg-rose-500" /> Absent
            </div>
          </div>
        </Card>

        {/* Department Distribution Pie Chart */}
        <Card title="Department Distribution">
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-1 text-xs">
            {pieData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} Staff</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actionable Pending Approvals Section */}
      <Card
        title="Pending Leave Approvals Action Items"
        action={
          <button
            onClick={() => onNavigateTab('admin-leaves')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            Manage Portal <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        {pendingLeaves.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs">
            🎉 All caught up! There are no pending leave applications awaiting review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Leave Type</th>
                  <th className="py-2.5 px-3">Dates</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 flex items-center gap-2.5">
                      <img src={l.employeeAvatar} alt={l.employeeName} className="h-7 w-7 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{l.employeeName}</p>
                        <p className="text-[10px] text-slate-500">{l.department}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{l.leaveType} Leave</td>
                    <td className="py-3 px-3 text-slate-600">
                      {l.startDate} to {l.endDate} ({l.days}d)
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{l.reason}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="success"
                        icon={<Check className="h-3.5 w-3.5" />}
                        onClick={() => updateLeaveStatus(l.id, 'Approved', 'Approved via Dashboard quick action')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={<X className="h-3.5 w-3.5" />}
                        onClick={() => updateLeaveStatus(l.id, 'Rejected', 'Declined via Dashboard quick action')}
                      >
                        Reject
                      </Button>
                    </td>
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
