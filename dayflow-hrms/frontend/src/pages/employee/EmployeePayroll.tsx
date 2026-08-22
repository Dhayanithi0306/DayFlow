import React, { useEffect, useState } from 'react';
import { SalaryStructure, ComputedSalaryTotals, PayrollRecord } from '../../types';
import { payrollService, PayrollQueryParams } from '../../services/payrollService';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Pagination } from '../../components/common/Pagination';
import { SalarySummaryCard } from '../../components/payroll/SalarySummaryCard';
import { SalaryBreakdown } from '../../components/payroll/SalaryBreakdown';
import { PayrollTable } from '../../components/payroll/PayrollTable';
import { PayrollDetailsModal } from '../../components/payroll/PayrollDetailsModal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Lock } from 'lucide-react';

export const EmployeePayroll: React.FC = () => {
  const [configured, setConfigured] = useState<boolean>(true);
  const [structure, setStructure] = useState<SalaryStructure | null>(null);
  const [computed, setComputed] = useState<ComputedSalaryTotals | null>(null);
  const [history, setHistory] = useState<PayrollRecord[]>([]);

  const [loadingSalary, setLoadingSalary] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);

  const fetchSalary = async () => {
    try {
      const res = await payrollService.getEmployeeSalary();
      if (res.success && res.data) {
        setConfigured(res.data.configured);
        if (res.data.configured) {
          setStructure(res.data.structure || null);
          setComputed(res.data.computed || null);
        }
      }
    } catch (err) {
      console.error('Error fetching employee salary:', err);
    } finally {
      setLoadingSalary(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const params: PayrollQueryParams = { page, limit: 10 };
      const res = await payrollService.getEmployeePayrollHistory(params);
      if (res.success && res.data) {
        setHistory(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching payroll history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSalary();
    fetchHistory();
  }, [page]);

  if (loadingSalary) {
    return <LoadingState message="Loading payroll portal..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary & Payroll Slips"
        subtitle="View your active salary structure, monthly breakdown, and historical payslips."
      />

      {/* Read-Only Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
        <Lock size={16} className="text-amber-600 shrink-0" />
        <span>
          Salary information is read-only for employee accounts. Contact HR Administrators for salary updates.
        </span>
      </div>

      {!configured || !computed ? (
        <EmptyState
          title="No Salary Structure Configured"
          description="Your salary structure has not been configured yet. Please contact HR."
        />
      ) : (
        <>
          {/* Salary Summary Card */}
          <SalarySummaryCard
            grossSalary={computed.grossSalary}
            totalDeductions={computed.totalDeductions}
            netSalary={computed.netSalary}
            currency={structure?.currency || 'INR'}
          />

          {/* Itemized Salary Breakdown */}
          <SalaryBreakdown structure={structure} computed={computed} currency={structure?.currency || 'INR'} />
        </>
      )}

      {/* Payroll History Table */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Payroll Statements Log</h3>
        <PayrollTable
          data={history}
          loading={loadingHistory}
          onViewRecord={(rec) => {
            setSelectedRecord(rec);
            setDetailsModalOpen(true);
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
      </div>

      {/* Details Modal */}
      <PayrollDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};
