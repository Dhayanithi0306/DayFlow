import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  User,
  Users,
  CheckSquare,
  ShieldCheck,
  Building2,
  HelpCircle,
  Briefcase,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, leaveRequests } = useHRMS();
  const isAdmin = currentUser?.role === 'admin';

  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;

  const employeeNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'attendance', label: 'My Attendance', icon: <CalendarCheck className="h-4 w-4" /> },
    { id: 'leave', label: 'Leave Requests', icon: <CalendarDays className="h-4 w-4" /> },
    { id: 'payroll', label: 'My Payslips', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="h-4 w-4" /> },
  ];

  const adminNav: NavItem[] = [
    { id: 'admin-dashboard', label: 'HR Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'admin-employees', label: 'Employees', icon: <Users className="h-4 w-4" /> },
    { id: 'admin-attendance', label: 'Attendance Logs', icon: <CalendarCheck className="h-4 w-4" /> },
    {
      id: 'admin-leaves',
      label: 'Leave Approvals',
      icon: <CheckSquare className="h-4 w-4" />,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
    },
    { id: 'admin-payroll', label: 'Salary & Payroll', icon: <CreditCard className="h-4 w-4" /> },
  ];

  const currentNav = isAdmin ? adminNav : employeeNav;

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4">
          {/* Active Mode Banner */}
          <div
            className={`p-3 rounded-xl mb-4 border flex items-center justify-between ${
              isAdmin
                ? 'bg-violet-50/80 border-violet-200 text-violet-950'
                : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
            }`}
          >
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <ShieldCheck className="h-4 w-4 text-violet-600 shrink-0" />
              ) : (
                <Briefcase className="h-4 w-4 text-indigo-600 shrink-0" />
              )}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Portal View</p>
                <p className="text-xs font-extrabold">{isAdmin ? 'HR Administration' : 'Employee Self-Service'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Category Header */}
          <div className="px-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {isAdmin ? 'Management' : 'Self Service'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {currentNav.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    isActive
                      ? isAdmin
                        ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-100'
                        : 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-white text-violet-700'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2 mb-1 text-slate-700">
              <Building2 className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-bold">Acme Global Inc.</span>
            </div>
            <p className="text-[11px] text-slate-500">San Francisco HQ • 120 Employees</p>
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Dayflow v1.4.0</span>
              <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer">
                <HelpCircle className="h-3 w-3" /> Support
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
