import React, { useEffect, useState } from 'react';
import { Attendance, Department, AttendanceStatus } from '../../types';
import { attendanceService, AttendanceSummaryData, AttendanceQueryParams } from '../../services/attendanceService';
import { employeeService } from '../../services/employeeService';
import { PageHeader } from '../../components/common/PageHeader';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { DatePicker } from '../../components/common/DatePicker';
import { Pagination } from '../../components/common/Pagination';
import { AttendanceSummaryCards } from '../../components/attendance/AttendanceSummaryCards';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import { AttendanceCorrectionModal } from '../../components/attendance/AttendanceCorrectionModal';

export const AdminAttendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState<AttendanceSummaryData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter & Pagination state
  const [departmentId, setDepartmentId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Admin correction modal state
  const [selectedRecord, setSelectedRecord] = useState<Attendance | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const fetchSummary = async () => {
    try {
      const res = await attendanceService.getAdminSummary();
      if (res.success && res.data?.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching admin attendance summary:', err);
    }
  };

  const fetchAttendanceList = async () => {
    setLoading(true);
    try {
      const params: AttendanceQueryParams = {
        page,
        limit: 10,
        departmentId: departmentId || undefined,
        status: (status as AttendanceStatus) || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const res = await attendanceService.listAdminAttendance(params);
      if (res.success && res.data) {
        setAttendanceRecords(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching admin attendance directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const loadDepartments = async () => {
      try {
        const res = await employeeService.listDepartments();
        if (res.success && res.data?.departments) setDepartments(res.data.departments);
      } catch (err) {
        console.error('Error loading departments:', err);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    fetchAttendanceList();
  }, [page, departmentId, status, startDate, endDate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Attendance Monitoring"
        subtitle="Track company-wide daily attendance, shifts, and perform corrections."
      />

      {/* Summary Cards */}
      <AttendanceSummaryCards summary={summary} />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <FilterDropdown
            label="Department"
            value={departmentId}
            onChange={(val) => {
              setDepartmentId(val);
              setPage(1);
            }}
            options={[
              { label: 'All Departments', value: '' },
              ...departments.map((d) => ({ label: d.name, value: d.id })),
            ]}
          />

          <FilterDropdown
            label="Status"
            value={status}
            onChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'PRESENT', value: 'PRESENT' },
              { label: 'HALF_DAY', value: 'HALF_DAY' },
              { label: 'ABSENT', value: 'ABSENT' },
              { label: 'LEAVE', value: 'LEAVE' },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="w-40">
            <DatePicker
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <span className="text-xs text-slate-400">to</span>
          <div className="w-40">
            <DatePicker
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Attendance Directory Table */}
      <AttendanceTable
        data={attendanceRecords}
        loading={loading}
        isAdmin={true}
        onEditRecord={(record) => {
          setSelectedRecord(record);
          setModalOpen(true);
        }}
        pagination={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={10}
            onPageChange={setPage}
          />
        }
      />

      {/* Admin Correction Modal */}
      <AttendanceCorrectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        record={selectedRecord}
        onSuccess={() => {
          fetchAttendanceList();
          fetchSummary();
        }}
      />
    </div>
  );
};
