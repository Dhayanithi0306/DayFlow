import React, { useEffect, useState } from 'react';
import { LeaveRequest, LeaveBalance } from '../../types';
import { leaveService, LeaveQueryParams } from '../../services/leaveService';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LeaveBalanceCards } from '../../components/leave/LeaveBalanceCards';
import { LeaveTable } from '../../components/leave/LeaveTable';
import { LeaveRequestFormModal } from '../../components/leave/LeaveRequestFormModal';
import { LoadingState } from '../../components/common/LoadingState';
import { CalendarPlus } from 'lucide-react';

export const EmployeeTimeOff: React.FC = () => {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  const [loadingBalances, setLoadingBalances] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchBalances = async () => {
    try {
      const res = await leaveService.getEmployeeLeaveBalances();
      if (res.success && res.data?.balances) {
        setBalances(res.data.balances);
      }
    } catch (err) {
      console.error('Error fetching leave balances:', err);
    } finally {
      setLoadingBalances(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const params: LeaveQueryParams = { page, limit: 10 };
      const res = await leaveService.getEmployeeLeaveHistory(params);
      if (res.success && res.data) {
        setRequests(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching leave history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchBalances();
    fetchHistory();
  }, [page]);

  if (loadingBalances) {
    return <LoadingState message="Loading time off portal..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Off & Leave Management"
        subtitle="View leave allocations, apply for time off, and track request status."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setFormModalOpen(true)}
            icon={<CalendarPlus size={16} />}
          >
            Apply for Time Off
          </Button>
        }
      />

      {/* Leave Balance Cards */}
      <LeaveBalanceCards balances={balances} />

      {/* Leave Request History Table */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">My Leave Applications</h3>
        <LeaveTable
          data={requests}
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

      {/* Apply Leave Modal */}
      <LeaveRequestFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={() => {
          fetchBalances();
          fetchHistory();
        }}
      />
    </div>
  );
};
