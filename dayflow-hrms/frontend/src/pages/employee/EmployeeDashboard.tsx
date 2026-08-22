import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services/employeeService';
import { Employee } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import {
  User,
  Clock,
  CalendarDays,
  CreditCard,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await employeeService.getSelfProfile();
        if (res.success && res.data?.employee) {
          setEmployee(res.data.employee);
        }
      } catch (err) {
        console.error('Error fetching employee dashboard profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingState message="Loading your employee portal dashboard..." />;
  }

  const displayName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : user?.email || 'Employee';

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${displayName}!`}
        subtitle="Your personalized employee self-service hub."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/employee/profile')}
            icon={<User size={16} />}
          >
            View Full Profile
          </Button>
        }
      />

      {/* Profile Overview Header Card */}
      <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-0 shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <Avatar name={displayName} src={employee?.profilePictureUrl} size="xl" className="ring-4 ring-white/20" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-white">{displayName}</h2>
                <Badge variant="success" size="sm">
                  {employee?.employmentStatus || 'ACTIVE'}
                </Badge>
              </div>
              <p className="text-xs text-indigo-200 font-medium">{employee?.designation || 'Team Member'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Badge variant="primary" size="sm">ID</Badge>
                  {employee?.employeeId || 'N/A'}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={14} className="text-indigo-400" />
                  {(employee as any)?.department?.name || 'Department'}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-sky-400" />
                  {employee?.location || 'Main Office'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center sm:text-right shrink-0 min-w-[200px]">
            <p className="text-[10px] uppercase font-semibold text-indigo-200 tracking-wider">Account Status</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center justify-center sm:justify-end gap-1.5 mt-0.5">
              <ShieldCheck size={16} /> Verified & Active
            </p>
            <p className="text-[11px] text-slate-300 mt-2 font-mono">
              Role: <span className="text-indigo-300 font-semibold">{user?.role}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          icon={<User size={22} />}
          label="Profile Status"
          value="Complete"
          description="Self-service profile active"
          iconColor="indigo"
        />

        <StatCard
          icon={<Clock size={22} />}
          label="Attendance"
          value="Stage 6"
          description="Check-in module next"
          iconColor="sky"
        />

        <StatCard
          icon={<CalendarDays size={22} />}
          label="Time Off Requests"
          value="Stage 7"
          description="Leave request engine next"
          iconColor="amber"
        />

        <StatCard
          icon={<CreditCard size={22} />}
          label="Payroll Slips"
          value="Stage 8"
          description="Salary processing next"
          iconColor="emerald"
        />
      </div>

      {/* Module Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card title="Employee Profile Management">
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              View and manage your general profile, private contact information, job details, uploaded documents, and salary structure.
            </p>
            <Link
              to="/employee/profile"
              className="w-full inline-flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl transition-colors"
            >
              <span>Manage Profile Details</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </Card>

        {/* Attendance Module Placeholder */}
        <Card title="Attendance & Check-in">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
              <Sparkles size={24} className="text-sky-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">Attendance Module Integration</p>
              <p className="text-[11px] text-slate-500">
                Daily check-in, check-out, working hours logging, and attendance history will be activated in Stage 6.
              </p>
            </div>
            <div className="text-center text-xs text-slate-400 font-semibold py-1">
              Coming in Stage 6
            </div>
          </div>
        </Card>

        {/* Leave / Time Off Module Placeholder */}
        <Card title="Time Off & Leave Requests">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
              <Sparkles size={24} className="text-amber-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">Leave Processing Engine</p>
              <p className="text-[11px] text-slate-500">
                Paid, sick, and unpaid leave applications and balance tracking will be activated in Stage 7.
              </p>
            </div>
            <div className="text-center text-xs text-slate-400 font-semibold py-1">
              Coming in Stage 7
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
