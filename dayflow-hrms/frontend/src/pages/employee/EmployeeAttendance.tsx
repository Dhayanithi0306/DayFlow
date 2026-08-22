import React, { useEffect, useState } from 'react';
import { Attendance } from '../../types';
import { attendanceService, AttendanceSummaryData, AttendanceQueryParams } from '../../services/attendanceService';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Tabs } from '../../components/common/Tabs';
import { Pagination } from '../../components/common/Pagination';
import { CheckInCard } from '../../components/attendance/CheckInCard';
import { AttendanceSummaryCards } from '../../components/attendance/AttendanceSummaryCards';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import { LoadingState } from '../../components/common/LoadingState';
import { Clock, Calendar, BarChart2 } from 'lucide-react';

export const EmployeeAttendance: React.FC = () => {
  const { showToast } = useToast();

  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState<AttendanceSummaryData | null>(null);

  const [loadingToday, setLoadingToday] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [viewTab, setViewTab] = useState<string>('daily');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchTodayAttendance = async () => {
    try {
      const res = await attendanceService.getTodayAttendance();
      if (res.success) {
        setTodayAttendance(res.data?.attendance || null);
      }
    } catch (err) {
      console.error('Error fetching today attendance:', err);
    } finally {
      setLoadingToday(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const params: AttendanceQueryParams = { page, limit: 10 };
      const res = await attendanceService.getEmployeeAttendance(params);
      if (res.success && res.data) {
        setHistory(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching attendance history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchSummary = async (timeframe: 'week' | 'month') => {
    try {
      const res = await attendanceService.getEmployeeSummary(timeframe);
      if (res.success && res.data?.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching attendance summary:', err);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  useEffect(() => {
    fetchSummary(viewTab === 'weekly' ? 'week' : 'month');
  }, [viewTab]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await attendanceService.checkIn();
      if (res.success && res.data?.attendance) {
        setTodayAttendance(res.data.attendance);
        showToast(res.message || 'Checked in successfully.', 'success');
        fetchHistory();
        fetchSummary(viewTab === 'weekly' ? 'week' : 'month');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Check-in failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await attendanceService.checkOut();
      if (res.success && res.data?.attendance) {
        setTodayAttendance(res.data.attendance);
        showToast(res.message || 'Checked out successfully.', 'success');
        fetchHistory();
        fetchSummary(viewTab === 'weekly' ? 'week' : 'month');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Check-out failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loadingToday) {
    return <LoadingState message="Loading attendance portal..." />;
  }

  const viewTabs = [
    { id: 'daily', label: 'Daily Action', icon: <Clock size={16} /> },
    { id: 'weekly', label: 'Weekly Summary', icon: <Calendar size={16} /> },
    { id: 'monthly', label: 'Monthly History', icon: <BarChart2 size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Workday Tracking"
        subtitle="Record daily arrival, track working hours, and review attendance history."
      />

      {/* Primary Action Card */}
      <CheckInCard
        todayAttendance={todayAttendance}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        loading={actionLoading}
      />

      {/* View Selector Tabs */}
      <Tabs tabs={viewTabs} activeTab={viewTab} onChange={setViewTab} />

      {/* Summary Cards */}
      <AttendanceSummaryCards summary={summary} />

      {/* Attendance History Table */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Attendance Log</h3>
        <AttendanceTable
          data={history}
          loading={loadingHistory}
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
      </div>
    </div>
  );
};
