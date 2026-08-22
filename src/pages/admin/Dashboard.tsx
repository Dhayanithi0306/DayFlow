import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../data/mockAdmin';
import type { EmployeeOverview } from '../../data/mockAdmin';
import { 
  Users, UserCheck, UserMinus, Clock, Calendar, 
  Search, Filter, ArrowRight, X, Building,
  Banknote, Activity
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [kpis] = useState(adminService.getKPIs());
  const [employees] = useState(adminService.getEmployees());
  const [pendingLeaves] = useState(adminService.getPendingLeaves());
  const [recentActivity] = useState(adminService.getRecentActivity());
  const [attendanceOverview] = useState(adminService.getAttendanceOverview());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOverview | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
  });

  const getGreeting = () => {
    if (currentUser?.role === 'admin') return 'Administrator';
    if (currentUser?.role === 'hr') return 'HR Officer';
    return 'User';
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'present': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'absent': return 'bg-red-50 text-red-700 border-red-200';
      case 'half-day': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'leave': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'no leave': return 'text-slate-500';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'leave': return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'attendance': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'payroll': return <Banknote className="w-4 h-4 text-emerald-600" />;
      case 'system': return <Building className="w-4 h-4 text-indigo-600" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || emp.attendance === statusFilter;
    
    return matchesSearch && matchesDept && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Good morning, {getGreeting()}
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening across your organization.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Today's Date</p>
          <div className="flex items-center text-slate-900 font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
            {currentDate}
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shrink-0 mr-4">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{kpis.totalEmployees}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Employees</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shrink-0 mr-4">
            <UserCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{kpis.presentToday}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Present Today</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center border border-purple-100 shrink-0 mr-4">
            <UserMinus className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{kpis.onLeave}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">On Leave</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 shrink-0 mr-4">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{kpis.pendingRequests}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Requests</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Employees */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="font-bold text-slate-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" /> Employees
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search employees..." 
                    className="pl-9 pr-8 py-2 w-full sm:w-48 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <div className="relative">
                    <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select 
                      className="pl-8 pr-6 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none appearance-none bg-white"
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                    >
                      <option value="All">All Depts</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="relative">
                    <select 
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Employee</th>
                    <th className="px-6 py-3">ID / Dept</th>
                    <th className="px-6 py-3">Attendance</th>
                    <th className="px-6 py-3">Leave Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mr-3 shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{emp.name}</p>
                            <p className="text-xs text-slate-500">{emp.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-slate-900 text-sm">{emp.id}</p>
                        <p className="text-xs text-slate-500">{emp.department}</p>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(emp.attendance)}`}>
                          {emp.attendance}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-medium ${getStatusColor(emp.leaveStatus)}`}>
                          {emp.leaveStatus}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button 
                          variant="outline" 
                          className="text-xs py-1 px-3"
                          onClick={() => setSelectedEmployee(emp)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        No employees match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredEmployees.map(emp => (
                <div key={emp.id} className="p-4 flex justify-between items-center bg-white">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mr-3 shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.id} • {emp.department}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="px-3 py-1.5"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900 flex items-center text-sm uppercase tracking-wider">
                Quick Actions
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start text-xs font-medium" onClick={() => navigate('/admin/employees')}>
                <Users className="w-4 h-4 mr-2 text-indigo-600" /> Add Employee
              </Button>
              <Button variant="outline" className="justify-start text-xs font-medium" onClick={() => navigate('/admin/leave-requests')}>
                <Calendar className="w-4 h-4 mr-2 text-purple-600" /> Approve Leave
              </Button>
              <Button variant="outline" className="justify-start text-xs font-medium" onClick={() => navigate('/admin/attendance')}>
                <Clock className="w-4 h-4 mr-2 text-amber-600" /> Attendance
              </Button>
              <Button variant="outline" className="justify-start text-xs font-medium" onClick={() => navigate('/admin/payroll')}>
                <Banknote className="w-4 h-4 mr-2 text-emerald-600" /> Run Payroll
              </Button>
            </div>
          </div>

          {/* Today's Attendance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2 text-indigo-600" /> Today's Attendance
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-center">
                <span className="block text-2xl font-black text-emerald-700">{attendanceOverview.present}</span>
                <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">Present</span>
              </div>
              <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-center">
                <span className="block text-2xl font-black text-red-700">{attendanceOverview.absent}</span>
                <span className="block text-xs font-bold text-red-600 uppercase tracking-wider mt-1">Absent</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-center">
                <span className="block text-2xl font-black text-amber-700">{attendanceOverview.halfDay}</span>
                <span className="block text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Half-day</span>
              </div>
              <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg text-center">
                <span className="block text-2xl font-black text-purple-700">{attendanceOverview.leave}</span>
                <span className="block text-xs font-bold text-purple-600 uppercase tracking-wider mt-1">Leave</span>
              </div>
            </div>
          </div>

          {/* Pending Leave Requests */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" /> Pending Leaves
              </h2>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingLeaves.length}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingLeaves.map(leave => (
                <div key={leave.id} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-slate-900 text-sm">{leave.employee}</p>
                    <p className="text-xs font-bold text-slate-500">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">{leave.type} ({leave.dateRange})</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <button 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center justify-center w-full"
                onClick={() => navigate('/admin/leave-requests')}
              >
                View All Requests <ArrowRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-sm flex items-center">
                <Activity className="w-4 h-4 mr-2 text-indigo-600" /> Recent Activity
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {recentActivity.map(act => (
                <div key={act.id} className="flex space-x-3">
                  <div className="mt-0.5 p-1.5 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
                    {getActivityIcon(act.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 leading-tight">{act.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Employee Details Drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-900">Employee Overview</h2>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-md">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{selectedEmployee.name}</h3>
                <p className="text-slate-500 font-medium">{selectedEmployee.designation}</p>
                
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                    {selectedEmployee.id}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusColor(selectedEmployee.employmentStatus)}`}>
                    {selectedEmployee.employmentStatus}
                  </span>
                </div>
              </div>

              {/* Attendance Summary */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-indigo-600" /> Attendance (This Month)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-slate-500 uppercase">Present</span>
                    <span className="block text-xl font-black text-emerald-600">{selectedEmployee.summary.attendance.present}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-slate-500 uppercase">Absent</span>
                    <span className="block text-xl font-black text-red-600">{selectedEmployee.summary.attendance.absent}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-slate-500 uppercase">Half-day</span>
                    <span className="block text-xl font-black text-amber-600">{selectedEmployee.summary.attendance.halfDay}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-bold text-slate-500 uppercase">Leave</span>
                    <span className="block text-xl font-black text-purple-600">{selectedEmployee.summary.attendance.leave}</span>
                  </div>
                </div>
              </div>

              {/* Leave Summary */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" /> Leave Requests
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <span className="block text-lg font-black text-amber-600">{selectedEmployee.summary.leave.pending}</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Pending</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <span className="block text-lg font-black text-emerald-600">{selectedEmployee.summary.leave.approved}</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Approved</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <span className="block text-lg font-black text-red-600">{selectedEmployee.summary.leave.rejected}</span>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mt-1">Rejected</span>
                  </div>
                </div>
              </div>

              {/* Payroll Summary */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                  <Banknote className="w-4 h-4 mr-2 text-indigo-600" /> Payroll (Current)
                </h4>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-indigo-900">Gross</span>
                    <span className="font-bold text-indigo-900">{formatCurrency(selectedEmployee.summary.payroll.gross)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-red-700">Deductions</span>
                    <span className="font-bold text-red-700">-{formatCurrency(selectedEmployee.summary.payroll.deductions)}</span>
                  </div>
                  <div className="border-t border-indigo-200 pt-2 flex justify-between items-center">
                    <span className="font-bold text-indigo-900">Net Salary</span>
                    <span className="text-lg font-black text-indigo-700">{formatCurrency(selectedEmployee.summary.payroll.net)}</span>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white">
              <Button className="w-full" onClick={() => setSelectedEmployee(null)}>
                Close Overview
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
