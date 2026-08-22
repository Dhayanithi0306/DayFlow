import React, { useState, useEffect } from 'react';
import { 
  Clock, Search, Filter, 
  ChevronLeft, ChevronRight, X, User
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { adminAttendanceService } from '../../data/mockAdminAttendance';
import type { AdminDailyAttendance } from '../../data/mockAdminAttendance';
import { adminService } from '../../data/mockAdmin';
import { startOfWeek, addDays, subDays, addWeeks, subWeeks } from 'date-fns';

type ViewMode = 'daily' | 'weekly';

export const AdminAttendance: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Data state
  const [dailyRecords, setDailyRecords] = useState<AdminDailyAttendance[]>([]);
  const [weeklyRecords, setWeeklyRecords] = useState<AdminDailyAttendance[]>([]);
  const [summary, setSummary] = useState(adminAttendanceService.getAttendanceSummary(currentDate));
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Selected Employee for Drawer
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  
  const employees = adminService.getEmployees();
  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  // Fetch data on date or mode change
  useEffect(() => {
    if (viewMode === 'daily') {
      const records = adminAttendanceService.getAttendanceByDate(currentDate);
      setDailyRecords(records);
      setSummary(adminAttendanceService.getAttendanceSummary(currentDate));
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
      setWeeklyRecords(adminAttendanceService.getAttendanceByWeek(weekStart));
    }
  }, [currentDate, viewMode]);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate(prev => viewMode === 'daily' ? subDays(prev, 1) : subWeeks(prev, 1));
  };

  const handleNext = () => {
    setCurrentDate(prev => viewMode === 'daily' ? addDays(prev, 1) : addWeeks(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filtered Daily Records
  const filteredDaily = dailyRecords.filter(record => {
    const matchesSearch = 
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || record.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate Weekly Matrix
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  
  const filteredEmployeesForWeek = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Present': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Absent': return 'bg-red-50 text-red-700 border-red-200';
      case 'Half-day': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Leave': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getCompactStatusColor = (status: string | undefined) => {
    switch(status) {
      case 'Present': return 'bg-emerald-500';
      case 'Absent': return 'bg-red-500';
      case 'Half-day': return 'bg-amber-500';
      case 'Leave': return 'bg-purple-500';
      default: return 'bg-slate-200';
    }
  };

  // Selected Employee details
  const selectedEmpDetails = selectedEmployeeId ? employees.find(e => e.id === selectedEmployeeId) : null;
  const selectedEmpHistory = selectedEmployeeId ? adminAttendanceService.getAttendanceByEmployee(selectedEmployeeId) : [];
  
  // Calculate attendance percentage for drawer
  const calculateAttendancePercentage = () => {
    if (!selectedEmpHistory.length) return '0%';
    const totalDays = selectedEmpHistory.length;
    const presentDays = selectedEmpHistory.filter(r => r.status === 'Present').length;
    const halfDays = selectedEmpHistory.filter(r => r.status === 'Half-day').length;
    const effectivePresent = presentDays + (halfDays * 0.5);
    return Math.round((effectivePresent / totalDays) * 100) + '%';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Attendance</h1>
          <p className="text-slate-500 mt-1">Monitor attendance across your organization.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'daily' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'weekly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Weekly
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button onClick={handlePrev} className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleToday} className="px-3 py-1 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-md">
              Today
            </button>
            <button onClick={handleNext} className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-sm font-bold text-slate-900 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg border border-indigo-100 min-w-[150px] text-center">
            {viewMode === 'daily' 
              ? currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${addDays(weekStart, 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            }
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {viewMode === 'daily' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <p className="text-2xl font-black text-slate-900">{summary.totalEmployees}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Employees</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
            <p className="text-2xl font-black text-emerald-700">{summary.present}</p>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">Present</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm text-center">
            <p className="text-2xl font-black text-red-700">{summary.absent}</p>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mt-1">Absent</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm text-center">
            <p className="text-2xl font-black text-amber-700">{summary.halfDay}</p>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Half-day</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm text-center">
            <p className="text-2xl font-black text-purple-700">{summary.onLeave}</p>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mt-1">On Leave</p>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search employee or ID..." 
            className="pl-9 pr-8 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
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
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select 
              className="pl-9 pr-6 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none appearance-none bg-white"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>
          
          {viewMode === 'daily' && (
            <div className="relative flex-1 md:w-40">
              <select 
                className="px-3 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half-day">Half-day</option>
                <option value="Leave">On Leave</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {viewMode === 'daily' ? (
          <>
            {/* Daily View Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">ID / Dept</th>
                    <th className="px-6 py-4 text-center">Check-in</th>
                    <th className="px-6 py-4 text-center">Check-out</th>
                    <th className="px-6 py-4 text-center">Working Hours</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDaily.map(record => (
                    <tr 
                      key={record.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedEmployeeId(record.employeeId)}
                    >
                      <td className="px-6 py-3 font-semibold text-slate-900">{record.employeeName}</td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-slate-900 text-sm">{record.employeeId}</p>
                        <p className="text-xs text-slate-500">{record.department}</p>
                      </td>
                      <td className="px-6 py-3 text-center text-sm font-medium text-slate-600">{record.checkIn || '—'}</td>
                      <td className="px-6 py-3 text-center text-sm font-medium text-slate-600">{record.checkOut || '—'}</td>
                      <td className="px-6 py-3 text-center text-sm font-bold text-indigo-600">{record.workingHours || '—'}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredDaily.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No attendance records found for this criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Daily View Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredDaily.map(record => (
                <div 
                  key={record.id} 
                  className="p-4 bg-white cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedEmployeeId(record.employeeId)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-bold text-slate-900">{record.employeeName}</p>
                      <p className="text-xs text-slate-500">{record.employeeId} • {record.department}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center text-sm mt-3">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">In</span>
                      <span className="font-medium text-slate-700">{record.checkIn || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Out</span>
                      <span className="font-medium text-slate-700">{record.checkOut || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Hours</span>
                      <span className="font-bold text-indigo-600">{record.workingHours || '—'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Weekly View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4 sticky left-0 bg-slate-50 z-10">Employee</th>
                    {weekDays.map(day => (
                      <th key={day.toISOString()} className="px-4 py-4 text-center">
                        <span className="block text-slate-900">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="block text-slate-400 text-[10px]">{day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployeesForWeek.map(emp => (
                    <tr 
                      key={emp.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedEmployeeId(emp.id)}
                    >
                      <td className="px-6 py-3 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-100">
                        <p className="font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.id}</p>
                      </td>
                      {weekDays.map(day => {
                        const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const record = weeklyRecords.find(r => r.employeeId === emp.id && r.date === dateStr);
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                        
                        return (
                          <td key={day.toISOString()} className={`px-2 py-3 text-center ${isWeekend ? 'bg-slate-50' : ''}`}>
                            {record ? (
                              <div className="flex justify-center group relative">
                                <div className={`w-3 h-3 rounded-full ${getCompactStatusColor(record.status)}`} />
                                {/* Simple Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
                                  {record.status}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Employee Detail Drawer */}
      {selectedEmpDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-900">Attendance Details</h2>
              <button 
                onClick={() => setSelectedEmployeeId(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Profile Header */}
              <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedEmpDetails.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedEmpDetails.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{selectedEmpDetails.designation}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedEmpDetails.id}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedEmpDetails.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI Summary */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-indigo-600" /> 14-Day Summary
                </h4>
                
                <div className="bg-indigo-600 text-white rounded-xl p-4 flex justify-between items-center mb-4 shadow-md">
                  <span className="font-semibold text-indigo-100">Attendance Rate</span>
                  <span className="text-2xl font-black">{calculateAttendancePercentage()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Present</span>
                    <span className="text-lg font-black text-emerald-600">{selectedEmpHistory.filter(r=>r.status==='Present').length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Absent</span>
                    <span className="text-lg font-black text-red-600">{selectedEmpHistory.filter(r=>r.status==='Absent').length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Half-day</span>
                    <span className="text-lg font-black text-amber-600">{selectedEmpHistory.filter(r=>r.status==='Half-day').length}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Leave</span>
                    <span className="text-lg font-black text-purple-600">{selectedEmpHistory.filter(r=>r.status==='Leave').length}</span>
                  </div>
                </div>
              </div>

              {/* Recent History */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-indigo-600" /> Recent History
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {selectedEmpHistory.slice(0, 7).map(record => (
                    <div key={record.id} className="p-3 bg-white flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{record.date}</p>
                        <p className="text-xs text-slate-500">{record.day}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(record.status)} mb-1`}>
                          {record.status}
                        </span>
                        {(record.checkIn || record.checkOut) && (
                          <p className="text-[10px] text-slate-500 font-medium">
                            {record.checkIn} - {record.checkOut || 'Working'}
                          </p>
                        )}
                        {record.workingHours && (
                          <p className="text-[10px] font-bold text-indigo-600">
                            {record.workingHours}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-slate-200 bg-white shrink-0">
              <Button className="w-full" onClick={() => setSelectedEmployeeId(null)}>
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
