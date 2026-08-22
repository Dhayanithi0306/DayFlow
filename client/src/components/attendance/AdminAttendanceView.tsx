import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { AttendanceRecord, AttendanceStatus } from '../../types/hrms';
import { Search, Filter, Edit } from 'lucide-react';

export const AdminAttendanceView: React.FC = () => {
  const { attendanceRecords, setAttendanceRecords, addToast } = useHRMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editNotes, setEditNotes] = useState('');

  const filteredAttendance = attendanceRecords.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.date.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
  const halfDayCount = attendanceRecords.filter((a) => a.status === 'Half-day').length;
  const leaveCount = attendanceRecords.filter((a) => a.status === 'Leave').length;
  const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;

  const handleOpenEdit = (rec: AttendanceRecord) => {
    setSelectedRecord(rec);
    setEditStatus(rec.status);
    setEditNotes(rec.notes || '');
    setIsEditModalOpen(true);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    setAttendanceRecords((prev: AttendanceRecord[]) =>
      prev.map((r: AttendanceRecord) => {
        if (r.id === selectedRecord.id) {
          return {
            ...r,
            status: editStatus,
            notes: editNotes ? `${editNotes} (HR adjusted)` : 'HR adjusted',
          };
        }
        return r;
      })
    );

    addToast(`Attendance status updated to ${editStatus} for ${selectedRecord.employeeName}`, 'success');
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Attendance Logs"
        subtitle="Monitor real-time clock-in/out timestamps and perform manual attendance overrides."
        breadcrumbs={[{ label: 'Management' }, { label: 'Attendance' }]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Present</p>
            <p className="text-xl font-extrabold text-emerald-600 mt-1">{presentCount}</p>
          </div>
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Half-day Shift</p>
            <p className="text-xl font-extrabold text-amber-600 mt-1">{halfDayCount}</p>
          </div>
          <div className="h-3 w-3 rounded-full bg-amber-500" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">On Approved Leave</p>
            <p className="text-xl font-extrabold text-indigo-600 mt-1">{leaveCount}</p>
          </div>
          <div className="h-3 w-3 rounded-full bg-indigo-500" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Absent</p>
            <p className="text-xl font-extrabold text-rose-600 mt-1">{absentCount}</p>
          </div>
          <div className="h-3 w-3 rounded-full bg-rose-500" />
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee name or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Half-day">Half-day</option>
              <option value="Leave">Leave</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">HR Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{rec.employeeName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{rec.employeeId}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{rec.date}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{rec.checkIn || '--:--'}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{rec.checkOut || '--:--'}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {rec.hoursWorked > 0 ? `${rec.hoursWorked} hrs` : '--'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={rec.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic max-w-xs truncate">{rec.notes || 'Normal shift'}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Edit className="h-3.5 w-3.5 text-indigo-600" />}
                      onClick={() => handleOpenEdit(rec)}
                    >
                      Override
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedRecord && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Override Attendance: ${selectedRecord.employeeName}`}
          subtitle={`Date: ${selectedRecord.date}`}
        >
          <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Attendance Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Present">Present</option>
                <option value="Half-day">Half-day</option>
                <option value="Leave">Leave</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason / HR Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Approved manual check-in request due to technical glitch..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Override
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
