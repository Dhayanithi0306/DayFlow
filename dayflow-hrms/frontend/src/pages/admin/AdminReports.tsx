import React, { useEffect, useState } from 'react';
import { Department, Employee, Attendance, LeaveRequest, PayrollRecord } from '../../types';
import { reportService, ReportQueryParams } from '../../services/reportService';
import { employeeService } from '../../services/employeeService';
import { PageHeader } from '../../components/common/PageHeader';
import { Tabs } from '../../components/common/Tabs';
import { DatePicker } from '../../components/common/DatePicker';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { Pagination } from '../../components/common/Pagination';
import { Table, Column } from '../../components/common/Table';
import { ExportButton } from '../../components/reports/ExportButton';
import { Avatar } from '../../components/common/Avatar';
import { LeaveStatusBadge } from '../../components/leave/LeaveStatusBadge';
import { AttendanceStatusBadge } from '../../components/attendance/AttendanceStatusBadge';
import { formatDate, formatCurrency, formatMinutes } from '../../utils/formatters';

export const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('employees');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Report Data States
  const [reportData, setReportData] = useState<any[]>([]);

  // Filter States
  const [departmentId, setDepartmentId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [leaveType, setLeaveType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params: ReportQueryParams = {
        page,
        limit: 25,
        departmentId: departmentId || undefined,
        status: status || undefined,
        leaveType: leaveType || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      let res: any;
      if (activeTab === 'employees') {
        res = await reportService.getEmployeeReport(params);
      } else if (activeTab === 'attendance') {
        res = await reportService.getAttendanceReport(params);
      } else if (activeTab === 'leave') {
        res = await reportService.getLeaveReport(params);
      } else if (activeTab === 'payroll') {
        res = await reportService.getPayrollReport(params);
      }

      if (res && res.success && res.data) {
        setReportData(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDepts = async () => {
      try {
        const res = await employeeService.listDepartments();
        if (res.success && res.data?.departments) setDepartments(res.data.departments);
      } catch (err) {
        console.error('Error loading departments:', err);
      }
    };
    loadDepts();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [activeTab, page, departmentId, status, leaveType, startDate, endDate]);

  const handleExport = async (): Promise<Blob> => {
    const params: ReportQueryParams = {
      departmentId: departmentId || undefined,
      status: status || undefined,
      leaveType: leaveType || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    if (activeTab === 'employees') return reportService.exportEmployeeReport(params);
    if (activeTab === 'attendance') return reportService.exportAttendanceReport(params);
    if (activeTab === 'leave') return reportService.exportLeaveReport(params);
    return reportService.exportPayrollReport(params);
  };

  // Columns definition based on activeTab
  const getColumns = (): Column<any>[] => {
    if (activeTab === 'employees') {
      return [
        {
          key: 'employee',
          header: 'Employee Name & ID',
          render: (row: Employee) => (
            <div className="flex items-center gap-3">
              <Avatar name={`${row.firstName} ${row.lastName}`} src={row.profilePictureUrl} size="sm" />
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{row.firstName} {row.lastName}</p>
                <p className="text-[10px] text-indigo-700 font-mono">{row.employeeId}</p>
              </div>
            </div>
          ),
        },
        { key: 'department', header: 'Department', render: (row: Employee) => <span className="text-xs text-slate-700">{row.department?.name || 'N/A'}</span> },
        { key: 'designation', header: 'Designation', render: (row: Employee) => <span className="text-xs text-slate-700">{row.designation}</span> },
        { key: 'joiningDate', header: 'Joining Date', render: (row: Employee) => <span className="font-mono text-xs text-slate-700">{formatDate(row.joiningDate)}</span> },
        { key: 'status', header: 'Status', render: (row: Employee) => <span className="text-xs font-bold text-indigo-900 uppercase">{row.employmentStatus}</span> },
      ];
    }

    if (activeTab === 'attendance') {
      return [
        {
          key: 'employee',
          header: 'Employee',
          render: (row: Attendance) => {
            const emp = (row as any).employee;
            return emp ? (
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{emp.firstName} {emp.lastName}</p>
                <p className="text-[10px] text-indigo-700 font-mono">{emp.employeeId}</p>
              </div>
            ) : <span className="text-xs text-slate-400">N/A</span>;
          },
        },
        { key: 'date', header: 'Date', render: (row: Attendance) => <span className="font-mono text-xs text-slate-800">{formatDate(row.date)}</span> },
        { key: 'workingMinutes', header: 'Working Hours', render: (row: Attendance) => <span className="font-mono text-xs text-slate-700">{formatMinutes(row.workingMinutes)}</span> },
        { key: 'extraMinutes', header: 'Overtime', render: (row: Attendance) => <span className="font-mono text-xs text-amber-700">{formatMinutes(row.extraMinutes)}</span> },
        { key: 'status', header: 'Status', render: (row: Attendance) => <AttendanceStatusBadge status={row.status} /> },
      ];
    }

    if (activeTab === 'leave') {
      return [
        {
          key: 'employee',
          header: 'Employee',
          render: (row: LeaveRequest) => {
            const emp = (row as any).employee;
            return emp ? (
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{emp.firstName} {emp.lastName}</p>
                <p className="text-[10px] text-indigo-700 font-mono">{emp.employeeId}</p>
              </div>
            ) : <span className="text-xs text-slate-400">N/A</span>;
          },
        },
        { key: 'leaveType', header: 'Leave Type', render: (row: LeaveRequest) => <span className="text-xs font-semibold text-slate-800 uppercase">{row.leaveType}</span> },
        { key: 'startDate', header: 'Start Date', render: (row: LeaveRequest) => <span className="font-mono text-xs text-slate-800">{formatDate(row.startDate)}</span> },
        { key: 'endDate', header: 'End Date', render: (row: LeaveRequest) => <span className="font-mono text-xs text-slate-800">{formatDate(row.endDate)}</span> },
        { key: 'duration', header: 'Duration', render: (row: LeaveRequest) => <span className="font-mono text-xs font-bold text-indigo-700">{row.duration} Days</span> },
        { key: 'status', header: 'Status', render: (row: LeaveRequest) => <LeaveStatusBadge status={row.status} /> },
      ];
    }

    return [
      {
        key: 'employee',
        header: 'Employee',
        render: (row: PayrollRecord) => {
          const emp = (row as any).employee;
          return emp ? (
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">{emp.firstName} {emp.lastName}</p>
              <p className="text-[10px] text-indigo-700 font-mono">{emp.employeeId}</p>
            </div>
          ) : <span className="text-xs text-slate-400">N/A</span>;
        },
      },
      { key: 'payPeriod', header: 'Pay Period', render: (row: PayrollRecord) => <span className="font-mono text-xs text-slate-800">{formatDate(row.payPeriodStart)} – {formatDate(row.payPeriodEnd)}</span> },
      { key: 'grossSalary', header: 'Gross Salary', render: (row: PayrollRecord) => <span className="font-mono text-xs text-slate-800">{formatCurrency(row.grossSalary)}</span> },
      { key: 'totalDeductions', header: 'Deductions', render: (row: PayrollRecord) => <span className="font-mono text-xs text-rose-600">-{formatCurrency(row.totalDeductions)}</span> },
      { key: 'netSalary', header: 'Net Salary', render: (row: PayrollRecord) => <span className="font-mono text-xs font-extrabold text-emerald-700">{formatCurrency(row.netSalary)}</span> },
    ];
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Organization Reports"
        subtitle="Exportable database reports across workforce, attendance, leave, and payroll."
        action={
          <ExportButton
            onExport={handleExport}
            filename={`${activeTab.toUpperCase()}_Report.csv`}
            label={`Export ${activeTab.toUpperCase()} CSV`}
          />
        }
      />

      {/* Report Type Navigation Tabs */}
      <Tabs
        tabs={[
          { id: 'employees', label: 'Employee Headcount Report' },
          { id: 'attendance', label: 'Attendance Audit Report' },
          { id: 'leave', label: 'Time Off / Leave Report' },
          { id: 'payroll', label: 'Payroll & Salary Report' },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => {
          setActiveTab(tabId);
          setStatus('');
          setLeaveType('');
          setPage(1);
        }}
      />

      {/* Context-Aware Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4">
        <FilterDropdown
          label="Department"
          value={departmentId}
          onChange={(val) => { setDepartmentId(val); setPage(1); }}
          options={[
            { label: 'All Departments', value: '' },
            ...departments.map((d) => ({ label: d.name, value: d.id })),
          ]}
        />

        {activeTab === 'employees' && (
          <FilterDropdown
            label="Employment Status"
            value={status}
            onChange={(val) => { setStatus(val); setPage(1); }}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
              { label: 'ON_LEAVE', value: 'ON_LEAVE' },
              { label: 'TERMINATED', value: 'TERMINATED' },
            ]}
          />
        )}

        {activeTab === 'attendance' && (
          <FilterDropdown
            label="Attendance Status"
            value={status}
            onChange={(val) => { setStatus(val); setPage(1); }}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'PRESENT', value: 'PRESENT' },
              { label: 'ABSENT', value: 'ABSENT' },
              { label: 'HALF_DAY', value: 'HALF_DAY' },
              { label: 'LEAVE', value: 'LEAVE' },
            ]}
          />
        )}

        {activeTab === 'leave' && (
          <>
            <FilterDropdown
              label="Leave Status"
              value={status}
              onChange={(val) => { setStatus(val); setPage(1); }}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'PENDING', value: 'PENDING' },
                { label: 'APPROVED', value: 'APPROVED' },
                { label: 'REJECTED', value: 'REJECTED' },
              ]}
            />
            <FilterDropdown
              label="Leave Type"
              value={leaveType}
              onChange={(val) => { setLeaveType(val); setPage(1); }}
              options={[
                { label: 'All Types', value: '' },
                { label: 'Paid Leave', value: 'PAID' },
                { label: 'Sick Leave', value: 'SICK' },
                { label: 'Unpaid Leave', value: 'UNPAID' },
              ]}
            />
          </>
        )}

        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
        />
      </div>

      {/* Report Data Table */}
      <Table
        columns={getColumns()}
        data={reportData}
        loading={loading}
        emptyMessage={`No ${activeTab} records match the selected filters.`}
        keyExtractor={(row) => row.id}
        pagination={
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={25}
            onPageChange={setPage}
          />
        }
      />
    </div>
  );
};
