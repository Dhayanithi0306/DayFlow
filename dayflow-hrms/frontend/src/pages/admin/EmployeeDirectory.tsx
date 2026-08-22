import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService, EmployeeQueryParams } from '../../services/employeeService';
import { Employee, Department, EmploymentStatus } from '../../types';
import { PageHeader } from '../../components/common/PageHeader';
import { Table, Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { Pagination } from '../../components/common/Pagination';
import { CreateEmployeeModal } from './CreateEmployeeModal';
import { UserPlus, Eye, Edit, Building2 } from 'lucide-react';

export const EmployeeDirectory: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter & Pagination state
  const [search, setSearch] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [employmentStatus, setEmploymentStatus] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params: EmployeeQueryParams = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        departmentId: departmentId || undefined,
        employmentStatus: (employmentStatus as EmploymentStatus) || undefined,
      };

      const res = await employeeService.listEmployees(params);
      if (res.success && res.data) {
        setEmployees(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching employee directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search, departmentId, employmentStatus]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await employeeService.listDepartments();
        if (res.success && res.data?.departments) {
          setDepartments(res.data.departments);
        }
      } catch (err) {
        console.error('Error loading departments:', err);
      }
    };

    loadDepartments();
  }, []);

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.firstName} ${row.lastName}`} src={row.profilePictureUrl} size="md" />
          <div>
            <p className="text-xs font-bold text-slate-900 leading-tight">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">{(row as any).user?.email || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (row) => <span className="font-mono text-xs font-bold text-indigo-700">{row.employeeId}</span>,
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium">
          <Building2 size={13} className="text-slate-400" />
          {(row as any).department?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.designation}</span>,
    },
    {
      key: 'manager',
      header: 'Manager',
      render: (row) => {
        const manager = (row as any).manager;
        return manager ? (
          <span className="text-xs text-slate-700">{`${manager.firstName} ${manager.lastName}`}</span>
        ) : (
          <span className="text-xs text-slate-400 italic">None</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.employmentStatus === 'ACTIVE'
            ? 'success'
            : row.employmentStatus === 'ON_LEAVE'
            ? 'warning'
            : row.employmentStatus === 'TERMINATED'
            ? 'danger'
            : 'neutral';
        return <Badge variant={variant} size="sm">{row.employmentStatus}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/employees/${row.id}`)}
            icon={<Eye size={14} />}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/employees/${row.id}`)}
            icon={<Edit size={14} />}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Employee Directory"
        subtitle="Manage company workforce, roles, status, and profiles."
        action={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<UserPlus size={16} />}
          >
            Add New Employee
          </Button>
        }
      />

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          placeholder="Search by name, ID, or email..."
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

          <FilterDropdown
            label="Status"
            value={employmentStatus}
            onChange={(val) => {
              setEmploymentStatus(val);
              setPage(1);
            }}
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'ACTIVE', value: 'ACTIVE' },
              { label: 'INACTIVE', value: 'INACTIVE' },
              { label: 'ON_LEAVE', value: 'ON_LEAVE' },
              { label: 'TERMINATED', value: 'TERMINATED' },
            ]}
          />
        </div>
      </div>

      {/* Directory Data Table */}
      <Table
        columns={columns}
        data={employees}
        loading={loading}
        emptyMessage="No employees found matching your criteria."
        keyExtractor={(row) => row.id}
        onRowClick={(row) => navigate(`/admin/employees/${row.id}`)}
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

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          fetchEmployees();
        }}
      />
    </div>
  );
};
