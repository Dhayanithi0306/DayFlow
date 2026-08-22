import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AttendanceStatus } from '../../types/hrms';
import { Search, Calendar, Filter, Clock } from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { currentUser, attendanceRecords } = useHRMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter logs for logged-in user
  const userLogs = attendanceRecords.filter((a) => a.employeeId === currentUser?.employeeId);

  // Apply search & status filters
  const filteredLogs = userLogs.filter((log) => {
    const matchesSearch =
      log.date.includes(searchTerm) || (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = userLogs.filter((l) => l.status === 'Present').length;
  const halfDayCount = userLogs.filter((l) => l.status === 'Half-day').length;
  const absentCount = userLogs.filter((l) => l.status === 'Absent').length;
  const leaveCount = userLogs.filter((l) => l.status === 'Leave').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance Logs"
        subtitle="Track your daily clock-in timestamps, working hours, and monthly logs."
        breadcrumbs={[{ label: 'Self Service' }, { label: 'Attendance' }]}
      />

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold">P</div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-400">Present</p>
            <p className="text-xl font-bold text-slate-900">{presentCount} Days</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 font-bold">H</div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-400">Half-day</p>
            <p className="text-xl font-bold text-slate-900">{halfDayCount} Days</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold">L</div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-400">On Leave</p>
            <p className="text-xl font-bold text-slate-900">{leaveCount} Days</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 font-bold">A</div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-400">Absent</p>
            <p className="text-xl font-bold text-slate-900">{absentCount} Days</p>
          </div>
        </div>
      </div>

      {/* Log Table Card */}
      <Card>
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search date or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Half-day">Half-day</option>
              <option value="Leave">Leave</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No attendance records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      {log.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {log.checkIn || '--:--'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {log.checkOut || '--:--'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {log.hoursWorked > 0 ? `${log.hoursWorked} hrs` : '--'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={log.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 italic">{log.notes || 'Normal shift'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
