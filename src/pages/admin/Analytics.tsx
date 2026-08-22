import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, UserCheck, UserX, Clock, 
  Wallet, TrendingUp, Calendar as CalendarIcon, Info
} from 'lucide-react';

// Services
import { adminService } from '../../data/mockAdmin';
import { leaveService } from '../../data/mockLeave';
import { globalPayrollRecords } from '../../data/mockPayroll';

// Tooltip Component
const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-flex ml-1.5 items-center justify-center">
    <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs rounded-lg p-2 text-center pointer-events-none z-10">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export const AdminAnalytics: React.FC = () => {
  // Filters
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [deptFilter, setDeptFilter] = useState('All');

  // Static reference data
  const allEmployees = adminService.getEmployees();
  const departments = ['All', ...Array.from(new Set(allEmployees.map(e => e.department)))];

  // Derived filtered data
  const filteredEmployees = useMemo(() => {
    if (deptFilter === 'All') return allEmployees;
    return allEmployees.filter(e => e.department === deptFilter);
  }, [allEmployees, deptFilter]);

  const filteredLeaves = useMemo(() => {
    let leaves = leaveService.getAllLeaveRequests();
    if (deptFilter !== 'All') leaves = leaves.filter(l => l.department === deptFilter);
    return leaves;
  }, [deptFilter]);

  const filteredPayroll = useMemo(() => {
    let records = globalPayrollRecords;
    if (deptFilter !== 'All') records = records.filter(r => r.department === deptFilter);
    return records;
  }, [deptFilter]);

  // KPIs for the selected month/year
  const kpis = useMemo(() => {
    const period = `${selectedMonth} ${selectedYear}`;
    
    // Attendance mock (Derived from employees to scale realistically)
    const totalEmps = filteredEmployees.length;
    let present = 0;
    let absent = 0;
    let onLeave = 0;
    
    filteredEmployees.forEach(emp => {
      const hash = emp.id.charCodeAt(emp.id.length - 1);
      present += 20 - (hash % 3);
      absent += hash % 2;
      onLeave += hash % 2;
    });

    const totalDays = present + absent + onLeave;
    const attendanceRate = totalDays ? Math.round((present / totalDays) * 100) : 0;

    // Leave
    const pendingLeaves = filteredLeaves.filter(l => l.status === 'Pending').length;

    // Payroll for the period
    const periodPayroll = filteredPayroll.filter(p => p.payPeriod === period);
    const totalGross = periodPayroll.reduce((sum, p) => sum + p.grossSalary, 0);
    const totalNet = periodPayroll.reduce((sum, p) => sum + p.netSalary, 0);

    return {
      totalEmployees: totalEmps,
      attendanceRate,
      onLeave,
      pendingLeaves,
      totalGross,
      totalNet
    };
  }, [filteredEmployees, filteredLeaves, filteredPayroll, selectedMonth, selectedYear]);

  // Chart 1: Payroll Trend (Over all months)
  const payrollTrendData = useMemo(() => {
    const months = ['March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026'];
    return months.map(m => {
      const records = filteredPayroll.filter(p => p.payPeriod === m);
      return {
        month: m.split(' ')[0].substring(0, 3), // Mar, Apr
        Gross: records.reduce((s, p) => s + p.grossSalary, 0),
        Net: records.reduce((s, p) => s + p.netSalary, 0)
      };
    });
  }, [filteredPayroll]);

  // Chart 2: Attendance Distribution
  const attendanceDistData = useMemo(() => {
    let present = 0, absent = 0, leave = 0, halfDay = 0;
    filteredEmployees.forEach(emp => {
      const hash = emp.id.charCodeAt(emp.id.length - 1);
      present += 20 - (hash % 3);
      absent += hash % 2;
      leave += hash % 2;
      halfDay += hash % 1;
    });
    return [
      { name: 'Present', value: present, color: '#10b981' },
      { name: 'Absent', value: absent, color: '#ef4444' },
      { name: 'Leave', value: leave, color: '#f59e0b' },
      { name: 'Half-day', value: halfDay, color: '#6366f1' }
    ];
  }, [filteredEmployees]);

  // Chart 3: Leave Distribution
  const leaveDistData = useMemo(() => {
    const paid = filteredLeaves.filter(l => l.type === 'Paid Leave').length;
    const sick = filteredLeaves.filter(l => l.type === 'Sick Leave').length;
    const unpaid = filteredLeaves.filter(l => l.type === 'Unpaid Leave').length;
    return [
      { name: 'Paid Leave', value: paid, color: '#6366f1' },
      { name: 'Sick Leave', value: sick, color: '#f43f5e' },
      { name: 'Unpaid Leave', value: unpaid, color: '#64748b' }
    ];
  }, [filteredLeaves]);

  // Chart 4: Department Distribution
  const deptDistData = useMemo(() => {
    if (deptFilter !== 'All') {
      return [{ name: deptFilter, count: filteredEmployees.length }];
    }
    const map = new Map<string, number>();
    filteredEmployees.forEach(e => {
      map.set(e.department, (map.get(e.department) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [filteredEmployees, deptFilter]);


  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const formatShortCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header & Global Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-slate-500 mt-1">Understand workforce, attendance, leave and payroll trends.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <select 
            className="px-3 py-1.5 border-none bg-transparent text-sm font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          
          <select 
            className="px-3 py-1.5 border-none bg-transparent text-sm font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {['August', 'July', 'June', 'May', 'April', 'March'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select 
            className="px-3 py-1.5 border-none bg-transparent text-sm font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">Total<br/>Employees</p>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><Users className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{kpis.totalEmployees}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Attendance<br/>Rate
              <InfoTooltip text="Percentage of recorded working days marked Present across all employees." />
            </p>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><UserCheck className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{kpis.attendanceRate}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">On<br/>Leave</p>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md"><UserX className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-amber-600">{kpis.onLeave}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">Pending<br/>Leaves</p>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md"><Clock className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-rose-600">{kpis.pendingLeaves}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">Gross<br/>Payroll</p>
            <div className="p-1.5 bg-slate-50 text-slate-600 rounded-md"><Wallet className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(kpis.totalGross)}</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight">Net<br/>Payroll</p>
            <div className="p-1.5 bg-slate-800 text-emerald-400 rounded-md"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-emerald-400">{formatCurrency(kpis.totalNet)}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Payroll Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Payroll Trend</h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">Last 6 Months</span>
          </div>
          <div className="h-[300px] w-full">
            {payrollTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={payrollTrendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis tickFormatter={formatShortCurrency} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <RechartsTooltip 
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="Gross" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Net" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Wallet className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Not enough data to display this trend.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 4: Department Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Employees by Department</h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">Headcount</span>
          </div>
          <div className="h-[300px] w-full">
            {deptDistData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptDistData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" name="Employees" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Not enough data.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Attendance Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Attendance Overview</h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">All Time</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center h-[300px]">
            {attendanceDistData.reduce((s, d) => s + d.value, 0) > 0 ? (
              <>
                <div className="w-full sm:w-1/2 h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceDistData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {attendanceDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col justify-center space-y-3 px-4">
                  {attendanceDistData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></div>
                        <span className="text-sm text-slate-600 font-medium">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Not enough data.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Leave Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Leave Distribution</h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">By Type</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center h-[300px]">
            {leaveDistData.reduce((s, d) => s + d.value, 0) > 0 ? (
              <>
                <div className="w-full sm:w-1/2 h-full min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveDistData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {leaveDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col justify-center space-y-3 px-4">
                  {leaveDistData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></div>
                        <span className="text-sm text-slate-600 font-medium">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{d.value}</span>
                    </div>
                  ))}
                  
                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Approved</span>
                      <span className="font-bold text-emerald-600">{filteredLeaves.filter(l => l.status === 'Approved').length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Pending</span>
                      <span className="font-bold text-amber-600">{filteredLeaves.filter(l => l.status === 'Pending').length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Rejected</span>
                      <span className="font-bold text-rose-600">{filteredLeaves.filter(l => l.status === 'Rejected').length}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <CalendarIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Not enough data.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
