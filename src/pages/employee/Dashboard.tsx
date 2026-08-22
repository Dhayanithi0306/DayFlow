import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MOCK_DASHBOARD_DATA } from '../../data/mockDashboard';
import { 
  User, 
  Clock, 
  Calendar, 
  Wallet,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const EmployeeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const data = MOCK_DASHBOARD_DATA;

  // Derive greeting based on time (mocked for simplicity, could be dynamic)
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const quickAccess = [
    { title: 'Profile', desc: 'View and manage your profile', icon: User, path: '/employee/profile', color: 'bg-blue-50 text-blue-600' },
    { title: 'Attendance', desc: 'Track your daily attendance', icon: Clock, path: '/employee/attendance', color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Leave Requests', desc: 'Apply for and track leave', icon: Calendar, path: '/employee/leave', color: 'bg-amber-50 text-amber-600' },
    { title: 'Payroll', desc: 'View your salary details', icon: Wallet, path: '/employee/payroll', color: 'bg-purple-50 text-purple-600' },
  ];

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch(type) {
      case 'success': return 'bg-emerald-50 border-emerald-100 text-emerald-800';
      case 'warning': return 'bg-amber-50 border-amber-100 text-amber-800';
      default: return 'bg-blue-50 border-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {greeting}, {currentUser?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your workday.</p>
        </div>
        <div className="flex items-center space-x-4 text-sm bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
          <div className="flex items-center border-r border-slate-200 pr-4">
            <span className="text-slate-400 mr-2 text-xs uppercase font-bold tracking-wider">ID</span>
            <span className="font-semibold text-slate-900">{data.employeeDetails.employeeId}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 text-slate-400 mr-2" />
            <span className="font-medium text-slate-700">{data.employeeDetails.designation}</span>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickAccess.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.path} className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{item.desc}</p>
              <div className="text-sm font-semibold text-indigo-600 flex items-center group-hover:text-indigo-700">
                View {item.title} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Workday */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Today's Attendance</h2>
              <span className="text-sm font-medium text-slate-500">{data.todayAttendance.date}</span>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    {data.todayAttendance.status}
                  </span>
                </div>
                
                <div className="flex gap-8 sm:gap-12">
                  <div className="text-center sm:text-left">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check-in</span>
                    <span className="text-lg font-bold text-slate-900">{data.todayAttendance.checkIn}</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check-out</span>
                    <span className="text-lg font-bold text-slate-400">{data.todayAttendance.checkOut}</span>
                  </div>
                </div>

                <div className="text-center sm:text-right p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</span>
                  <span className="text-xl font-bold text-indigo-600">{data.todayAttendance.workingHours}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" disabled={data.todayAttendance.isCheckedIn}>
                  Check In
                </Button>
                <Button variant="outline" className="flex-1 border-slate-200 hover:border-slate-300" disabled={!data.todayAttendance.isCheckedIn}>
                  Check Out
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                    {activity.icon === 'Calendar' && <Calendar className="w-5 h-5" />}
                    {activity.icon === 'Clock' && <Clock className="w-5 h-5" />}
                    {activity.icon === 'Wallet' && <Wallet className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                    <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
                  </div>
                  <div className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Alerts */}
          {data.alerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Alerts</h3>
              {data.alerts.map(alert => (
                <div key={alert.id} className={`flex items-start p-4 rounded-lg border ${getAlertStyle(alert.type)}`}>
                  <div className="shrink-0 mr-3 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <p className="text-sm font-medium">{alert.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Leave Overview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Leave Overview</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
                  <span className="block text-2xl font-black text-indigo-700">{data.leaveOverview.available}</span>
                  <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">Available</span>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                  <span className="block text-2xl font-black text-amber-700">{data.leaveOverview.pending}</span>
                  <span className="block text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Pending</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                  <span className="block text-2xl font-black text-emerald-700">{data.leaveOverview.approved}</span>
                  <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">Approved</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="block text-2xl font-black text-slate-700">{data.leaveOverview.rejected}</span>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Rejected</span>
                </div>
              </div>
              <Button variant="outline" className="w-full text-sm">View Leave Requests</Button>
            </div>
          </div>

          {/* Upcoming Leave */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900">Upcoming Leave</h2>
            </div>
            <div className="p-6">
              {data.upcomingLeave.length > 0 ? (
                <div className="space-y-4">
                  {data.upcomingLeave.map(leave => (
                    <div key={leave.id} className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-slate-900">{leave.type}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{leave.startDate} - {leave.endDate}</p>
                      <p className="text-xs font-medium text-slate-400">{leave.days} {leave.days === 1 ? 'day' : 'days'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">No upcoming leave scheduled.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
