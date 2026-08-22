import React, { useEffect, useState } from 'react';
import { PayrollRecord, Department, Employee, SalaryStructure } from '../../types';
import { payrollService, PayrollSummaryData, PayrollQueryParams } from '../../services/payrollService';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { Pagination } from '../../components/common/Pagination';
import { PayrollTable } from '../../components/payroll/PayrollTable';
import { SalaryEditModal } from '../../components/payroll/SalaryEditModal';
import { GeneratePayrollModal } from '../../components/payroll/GeneratePayrollModal';
import { PayrollDetailsModal } from '../../components/payroll/PayrollDetailsModal';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, ShieldAlert, Wallet, Play, Settings } from 'lucide-react';

export const AdminPayroll: React.FC = () => {
  const { showToast } = useToast();

  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummaryData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter & Pagination state
  const [search, setSearch] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Modals state
  const [generateModalOpen, setGenerateModalOpen] = useState<boolean>(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);

  // Salary Edit State
  const [salaryEditOpen, setSalaryEditOpen] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>('');
  const [currentStructure, setCurrentStructure] = useState<SalaryStructure | null>(null);

  const fetchSummary = async () => {
    try {
      const res = await payrollService.getAdminPayrollSummary();
      if (res.success && res.data?.summary) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Error fetching admin payroll summary:', err);
    }
  };

  const fetchPayrollList = async () => {
    setLoading(true);
    try {
      const params: PayrollQueryParams = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        departmentId: departmentId || undefined,
      };

      const res = await payrollService.listAdminPayroll(params);
      if (res.success && res.data) {
        setRecords(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching admin payroll list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const loadOptions = async () => {
      try {
        const [deptRes, empRes] = await Promise.all([
          employeeService.listDepartments(),
          employeeService.listEmployees({ limit: 100 }),
        ]);
        if (deptRes.success && deptRes.data?.departments) setDepartments(deptRes.data.departments);
        if (empRes.success && empRes.data?.items) setEmployees(empRes.data.items);
      } catch (err) {
        console.error('Error loading options:', err);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    fetchPayrollList();
  }, [page, search, departmentId]);

  const handleOpenSalaryEdit = async (empId: string, empName: string) => {
    try {
      const res = await payrollService.getAdminEmployeeSalary(empId);
      if (res.success && res.data) {
        setSelectedEmployeeId(empId);
        setSelectedEmployeeName(empName);
        setCurrentStructure(res.data.structure || null);
        setSalaryEditOpen(true);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to load employee salary details.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Payroll & Salary Management"
        subtitle="Manage employee salary structures, generate monthly payroll, and review financial logs."
        action={
          <div className="flex items-center gap-3">
            {employees.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenSalaryEdit(employees[0].id, `${employees[0].firstName} ${employees[0].lastName}`)}
                icon={<Settings size={16} />}
              >
                Configure Salary
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setGenerateModalOpen(true)}
              icon={<Play size={16} />}
            >
              Generate Monthly Payroll
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          icon={<DollarSign size={22} />}
          label="Total Gross Payroll"
          value={formatCurrency(summary?.totalGrossPayroll)}
          description={`${summary?.employeesWithSalary ?? 0} of ${summary?.totalEmployees ?? 0} active employees`}
          iconColor="indigo"
        />

        <StatCard
          icon={<ShieldAlert size={22} />}
          label="Total Deductions"
          value={formatCurrency(summary?.totalDeductions)}
          description="PF & Tax liabilities"
          iconColor="rose"
        />

        <StatCard
          icon={<Wallet size={22} />}
          label="Total Net Payroll"
          value={formatCurrency(summary?.totalNetPayroll)}
          description="Total company net outflow"
          iconColor="emerald"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by employee name or ID..."
          className="w-full sm:w-80"
        />

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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
        </div>
      </div>

      {/* Admin Payroll Directory Table */}
      <PayrollTable
        data={records}
        loading={loading}
        isAdmin={true}
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

      {/* Generate Payroll Modal */}
      <GeneratePayrollModal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSuccess={() => {
          fetchPayrollList();
          fetchSummary();
        }}
      />

      {/* Salary Edit Modal */}
      <SalaryEditModal
        isOpen={salaryEditOpen}
        onClose={() => setSalaryEditOpen(false)}
        employeeId={selectedEmployeeId}
        employeeName={selectedEmployeeName}
        currentStructure={currentStructure}
        onSuccess={() => {
          fetchPayrollList();
          fetchSummary();
        }}
      />

      {/* Details Modal */}
      <PayrollDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};
