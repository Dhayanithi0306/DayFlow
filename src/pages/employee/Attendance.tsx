import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle, 
  ChevronLeft, ChevronRight, List, Info
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { attendanceService } from '../../data/mockAttendance';
import type { DailyAttendance, AttendanceStatus } from '../../data/mockAttendance';

export const EmployeeAttendancePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isLoading, setIsLoading] = useState(false);
  
  // Data states
  const [todayData, setTodayData] = useState<DailyAttendance | null>(null);
  const [weeklyData, setWeeklyData] = useState<DailyAttendance[]>([]);
  const [historyData, setHistoryData] = useState<DailyAttendance[]>([]);

  // Simulation of current working hours update
  const [elapsedWorking, setElapsedWorking] = useState('0h 00m');

  useEffect(() => {
    loadData();
  }, [viewMode]);

  useEffect(() => {
    // Simulate live timer if checked in but not checked out
    let interval: ReturnType<typeof setInterval>;
    if (todayData?.status === 'Present' && todayData?.checkIn && !todayData?.checkOut) {
      const start = new Date();
      const match = todayData.checkIn.match(/(\d+):(\d+)\s+(AM|PM)/);
      if (match) {
        let hours = parseInt(match[1]);
        const mins = parseInt(match[2]);
        const ampm = match[3];
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        start.setHours(hours, mins, 0, 0);

        const updateElapsed = () => {
          const now = new Date();
          const diffMs = now.getTime() - start.getTime();
          if (diffMs > 0) {
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            setElapsedWorking(`${diffHrs}h ${diffMins}m`);
          }
        };
        
        updateElapsed();
        interval = setInterval(updateElapsed, 60000); // update every minute
      }
    }
    return () => clearInterval(interval);
  }, [todayData]);

  const loadData = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setTodayData(attendanceService.getDailyAttendance());
      setWeeklyData(attendanceService.getWeeklyAttendance());
      setHistoryData(attendanceService.getHistory());
      setIsLoading(false);
    }, 400);
  };

  const handleCheckIn = () => {
    setTodayData(attendanceService.checkIn());
  };

  const handleCheckOut = () => {
    if (todayData?.checkIn) {
      setTodayData(attendanceService.checkOut(todayData.checkIn));
    }
  };

  // Helper to change periods (Mock behavior - just triggers loading)
  const handlePeriodChange = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const getStatusStyle = (status: AttendanceStatus) => {
    switch(status) {
      case 'Present': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Absent': return 'bg-red-50 text-red-700 border-red-200';
      case 'Half-day': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Leave': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch(status) {
      case 'Present': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'Absent': return <XCircle className="w-4 h-4 mr-1.5" />;
      case 'Half-day': return <AlertCircle className="w-4 h-4 mr-1.5" />;
      case 'Leave': return <CalendarIcon className="w-4 h-4 mr-1.5" />;
      default: return <Clock className="w-4 h-4 mr-1.5" />;
    }
  };

  const currentDisplayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Calculate summary for weekly view
  const summary = {
    present: weeklyData.filter(d => d.status === 'Present').length,
    absent: weeklyData.filter(d => d.status === 'Absent').length,
    halfDay: weeklyData.filter(d => d.status === 'Half-day').length,
    leave: weeklyData.filter(d => d.status === 'Leave').length,
  };
  const totalDays = weeklyData.length || 1;
  const percentage = Math.round(((summary.present + (summary.halfDay * 0.5)) / totalDays) * 100) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Attendance</h1>
          <p className="text-slate-500 mt-1">Track your daily and weekly work attendance.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="bg-white p-1 rounded-lg border border-slate-200 flex w-full sm:w-auto shadow-sm">
            <button 
              onClick={() => setViewMode('daily')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'daily' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Daily
            </button>
            <button 
              onClick={() => setViewMode('weekly')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'weekly' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Weekly
            </button>
          </div>
          
          <div className="flex items-center space-x-1 w-full sm:w-auto">
            <Button variant="outline" className="px-2" onClick={handlePeriodChange}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none px-4" onClick={handlePeriodChange}>
              Today
            </Button>
            <Button variant="outline" className="px-2" onClick={handlePeriodChange}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Loading attendance data...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm font-semibold text-slate-600 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {viewMode === 'daily' ? currentDisplayDate : 'Current Week'}
          </div>

          {viewMode === 'daily' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily Action Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900">Today's Attendance</h2>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  
                  <div className="flex flex-col items-center text-center space-y-2 mb-8">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusStyle(todayData?.status || 'Not Checked In')}`}>
                      {getStatusIcon(todayData?.status || 'Not Checked In')}
                      {todayData?.status}
                    </span>
                    <p className="text-slate-500 text-sm">
                      {todayData?.date} • {todayData?.day}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check-in</span>
                      <span className="text-xl font-bold text-slate-900">{todayData?.checkIn || '--:--'}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check-out</span>
                      <span className="text-xl font-bold text-slate-900">{todayData?.checkOut || '--:--'}</span>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Working Hours</span>
                    <span className="text-3xl font-black text-indigo-600">
                      {todayData?.workingHours || (todayData?.checkIn && !todayData?.checkOut ? elapsedWorking : '--h --m')}
                    </span>
                    {todayData?.checkIn && !todayData?.checkOut && (
                      <span className="block text-xs font-medium text-emerald-600 mt-1 animate-pulse">Currently working</span>
                    )}
                  </div>

                  <div className="mt-auto">
                    {todayData?.status === 'Not Checked In' && (
                      <Button className="w-full text-lg py-6 shadow-md" onClick={handleCheckIn}>
                        Check In
                      </Button>
                    )}
                    {todayData?.status === 'Present' && todayData?.checkIn && !todayData?.checkOut && (
                      <Button variant="outline" className="w-full text-lg py-6 border-slate-300 hover:bg-slate-50" onClick={handleCheckOut}>
                        Check Out
                      </Button>
                    )}
                    {todayData?.status === 'Present' && todayData?.checkIn && todayData?.checkOut && (
                      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-center font-medium border border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Attendance completed for today
                      </div>
                    )}
                    {['Absent', 'Half-day', 'Leave'].includes(todayData?.status || '') && (
                      <div className="bg-slate-50 text-slate-600 p-4 rounded-lg text-center font-medium border border-slate-200 flex items-center justify-center">
                        <Info className="w-5 h-5 mr-2" />
                        No actions available for this status
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Informational Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hidden md:flex flex-col">
                <div className="h-full bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-indigo-100 flex items-center justify-center mb-6 text-indigo-500">
                    <Clock className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Time is money</h3>
                  <p className="text-slate-600 mb-6">Make sure to check in on time to maintain a perfect attendance record.</p>
                  <div className="space-y-3 w-full max-w-xs">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Standard Hours:</span>
                      <span className="text-slate-900 font-bold">09:00 AM - 06:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Required Time:</span>
                      <span className="text-slate-900 font-bold">8h 00m</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Weekly Summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-2xl font-black text-emerald-600">{summary.present}</span>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Present</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-2xl font-black text-amber-600">{summary.halfDay}</span>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Half-day</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-2xl font-black text-purple-600">{summary.leave}</span>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Leave</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-2xl font-black text-red-600">{summary.absent}</span>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Absent</span>
                </div>
                <div className="col-span-2 md:col-span-1 bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm text-center flex flex-col justify-center">
                  <span className="block text-3xl font-black text-indigo-700">{percentage}%</span>
                  <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider mt-1">Attendance</span>
                </div>
              </div>

              {/* Weekly Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h2 className="font-bold text-slate-900 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" /> Weekly Timesheet
                  </h2>
                </div>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Day</th>
                        <th className="px-6 py-4 text-center">Check-in</th>
                        <th className="px-6 py-4 text-center">Check-out</th>
                        <th className="px-6 py-4 text-center">Working Hours</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {weeklyData.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{record.date}</td>
                          <td className="px-6 py-4 text-slate-600">{record.day}</td>
                          <td className="px-6 py-4 text-center font-medium text-slate-700">{record.checkIn || '—'}</td>
                          <td className="px-6 py-4 text-center font-medium text-slate-700">{record.checkOut || '—'}</td>
                          <td className="px-6 py-4 text-center font-bold text-indigo-600">{record.workingHours || '—'}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusStyle(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {weeklyData.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <p>No attendance records found.</p>
                    </div>
                  )}
                </div>

                {/* Mobile Cards for Weekly View */}
                <div className="md:hidden divide-y divide-slate-100">
                  {weeklyData.map((record) => (
                    <div key={record.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-slate-900">{record.date} <span className="text-slate-500 font-normal ml-1">({record.day})</span></div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div>
                          <span className="block text-xs text-slate-500">In</span>
                          <span className="font-medium text-slate-900">{record.checkIn || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-slate-500">Out</span>
                          <span className="font-medium text-slate-900">{record.checkOut || '—'}</span>
                        </div>
                        <div className="col-span-2 pt-2 mt-1 border-t border-slate-200 flex justify-between items-center">
                          <span className="text-xs text-slate-500">Hours</span>
                          <span className="font-bold text-indigo-600">{record.workingHours || '—'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {weeklyData.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      <p>No attendance records found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Attendance History */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 flex items-center">
                <List className="w-5 h-5 mr-2 text-slate-500" /> Recent History
              </h2>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Check-in</th>
                    <th className="px-6 py-3 text-center">Check-out</th>
                    <th className="px-6 py-3 text-right">Working Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyData.slice(0, 10).map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-slate-900 text-sm">{record.date} <span className="text-slate-400 font-normal ml-1">({record.day})</span></td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center text-sm font-medium text-slate-600">{record.checkIn || '—'}</td>
                      <td className="px-6 py-3 text-center text-sm font-medium text-slate-600">{record.checkOut || '—'}</td>
                      <td className="px-6 py-3 text-right text-sm font-bold text-slate-700">{record.workingHours || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards for History */}
            <div className="md:hidden divide-y divide-slate-100">
              {historyData.slice(0, 5).map((record) => (
                <div key={record.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{record.date}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {record.checkIn ? `${record.checkIn} - ${record.checkOut || 'Working'}` : 'No punch data'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border mb-1 ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                    <div className="text-xs font-bold text-indigo-600">{record.workingHours || ''}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {historyData.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <p>No attendance records found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
