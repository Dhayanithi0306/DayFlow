import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService, UpdateEmployeeParams } from '../../services/employeeService';
import { Employee, Department, EmploymentStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import {
  User,
  Building2,
  MapPin,
  Edit,
  FileText,
  CreditCard,
  Briefcase,
  ShieldCheck,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [managerId, setManagerId] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const fetchEmployee = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await employeeService.getEmployeeById(id);
      if (res.success && res.data?.employee) {
        const emp = res.data.employee;
        setEmployee(emp);
        setFirstName(emp.firstName);
        setLastName(emp.lastName);
        setPhone(emp.phone || '');
        setJoiningDate(new Date(emp.joiningDate).toISOString().split('T')[0]);
        setDepartmentId(emp.departmentId);
        setDesignation(emp.designation);
        setManagerId(emp.managerId || '');
        setLocation(emp.location || '');
        setAddress(emp.address || '');
        setCity(emp.city || '');
        setState(emp.state || '');
        setPostalCode(emp.postalCode || '');
        setCountry(emp.country || '');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Employee not found.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [deptRes, empRes] = await Promise.all([
          employeeService.listDepartments(),
          employeeService.listEmployees({ limit: 100 }),
        ]);
        if (deptRes.success && deptRes.data?.departments) setDepartments(deptRes.data.departments);
        if (empRes.success && empRes.data?.items) setManagers(empRes.data.items);
      } catch (err) {
        console.error('Error loading options:', err);
      }
    };
    loadOptions();
  }, []);

  const handleStatusChange = async (newStatus: EmploymentStatus) => {
    if (!id || !employee) return;
    setUpdatingStatus(true);
    try {
      const res = await employeeService.updateEmployeeStatus(id, newStatus);
      if (res.success && res.data?.employee) {
        setEmployee(res.data.employee);
        showToast(`Employee status updated to ${newStatus}.`, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    try {
      const payload: UpdateEmployeeParams = {
        firstName,
        lastName,
        phone,
        joiningDate,
        departmentId,
        designation,
        managerId: managerId || undefined,
        location,
        address,
        city,
        state,
        postalCode,
        country,
      };

      const res = await employeeService.updateEmployee(id, payload);
      if (res.success && res.data?.employee) {
        setEmployee(res.data.employee);
        showToast('Employee updated successfully.', 'success');
        setEditModalOpen(false);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update employee.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading employee details..." />;
  if (!employee) return <EmptyState title="Employee not found" description="The requested employee record does not exist." />;

  const displayName = `${employee.firstName} ${employee.lastName}`;
  const departmentName = (employee as any).department?.name || 'Department';
  const managerName = (employee as any).manager
    ? `${(employee as any).manager.firstName} ${(employee as any).manager.lastName}`
    : 'None';
  const privateInfo = (employee as any).privateInfo;
  const documents = (employee as any).documents || [];
  const salaryStructure = (employee as any).salaryStructures?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={displayName}
        subtitle={`System Employee ID: ${employee.employeeId}`}
        breadcrumbs={<Breadcrumb items={[{ label: 'Employees', href: '/admin/employees' }, { label: displayName }]} />}
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/employees')} icon={<ArrowLeft size={16} />}>
              Back
            </Button>
            <Button variant="primary" size="sm" onClick={() => setEditModalOpen(true)} icon={<Edit size={16} />}>
              Edit Details
            </Button>
          </div>
        }
      />

      {/* Overview Header Card */}
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <Avatar name={displayName} src={employee.profilePictureUrl} size="xl" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
                <Badge
                  variant={
                    employee.employmentStatus === 'ACTIVE'
                      ? 'success'
                      : employee.employmentStatus === 'ON_LEAVE'
                      ? 'warning'
                      : employee.employmentStatus === 'TERMINATED'
                      ? 'danger'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {employee.employmentStatus}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">{employee.designation}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-2 font-mono">
                <span className="flex items-center gap-1">
                  <Badge variant="primary" size="sm">ID</Badge> {employee.employeeId}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={14} className="text-indigo-600" /> {departmentName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-sky-600" /> {employee.location || 'Main Office'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Status Lifecycle Control */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 min-w-[220px]">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lifecycle Status Control</p>
            <Select
              options={[
                { label: 'ACTIVE', value: 'ACTIVE' },
                { label: 'INACTIVE', value: 'INACTIVE' },
                { label: 'ON_LEAVE', value: 'ON_LEAVE' },
                { label: 'TERMINATED', value: 'TERMINATED' },
              ]}
              value={employee.employmentStatus}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value as EmploymentStatus)}
              className="text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="General & Contact Details">
          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">First Name</dt><dd className="font-semibold text-slate-900">{employee.firstName}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Last Name</dt><dd className="font-semibold text-slate-900">{employee.lastName}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Email Address</dt><dd className="font-semibold text-slate-900 font-mono">{(employee as any).user?.email || 'N/A'}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Phone</dt><dd className="font-semibold text-slate-900">{employee.phone || 'Not set'}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Address</dt><dd className="font-semibold text-slate-900">{employee.address || 'Not specified'}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">City / State / Country</dt><dd className="font-semibold text-slate-900">{[employee.city, employee.state, employee.country].filter(Boolean).join(', ') || 'Not specified'}</dd></div>
          </dl>
        </Card>

        <Card title="Employment Specifications">
          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">System Employee ID</dt><dd className="font-bold font-mono text-indigo-700">{employee.employeeId}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Department</dt><dd className="font-semibold text-slate-900">{departmentName}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Designation</dt><dd className="font-semibold text-slate-900">{employee.designation}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Reporting Manager</dt><dd className="font-semibold text-slate-900">{managerName}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Joining Date</dt><dd className="font-semibold font-mono text-slate-900">{new Date(employee.joiningDate).toLocaleDateString()}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Workplace Location</dt><dd className="font-semibold text-slate-900">{employee.location || 'Main Office'}</dd></div>
          </dl>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Private Information">
          <dl className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Nationality</dt><dd className="font-semibold text-slate-900">{privateInfo?.nationality || 'Not specified'}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Marital Status</dt><dd className="font-semibold text-slate-900">{privateInfo?.maritalStatus || 'Not specified'}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Personal Email</dt><dd className="font-semibold text-slate-900">{privateInfo?.personalEmail || 'Not specified'}</dd></div>
            <div className="py-2.5 flex justify-between"><dt className="text-slate-400">Emergency Contact</dt><dd className="font-semibold text-slate-900">{privateInfo?.emergencyContactName ? `${privateInfo.emergencyContactName} (${privateInfo.emergencyContactPhone || ''})` : 'Not specified'}</dd></div>
          </dl>
        </Card>

        <Card title="Salary Overview">
          {!salaryStructure ? (
            <EmptyState title="No active salary structure" description="No salary structure record found for this employee." />
          ) : (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-400 block text-[10px] uppercase font-semibold">Basic Salary</span><span className="text-sm font-bold font-mono text-slate-900">₹{Number(salaryStructure.basicSalary).toLocaleString()}</span></div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-400 block text-[10px] uppercase font-semibold">HRA</span><span className="text-sm font-bold font-mono text-slate-900">₹{Number(salaryStructure.hra).toLocaleString()}</span></div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-400 block text-[10px] uppercase font-semibold">Fixed Allowance</span><span className="text-sm font-bold font-mono text-slate-900">₹{Number(salaryStructure.fixedAllowance).toLocaleString()}</span></div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200"><span className="text-slate-400 block text-[10px] uppercase font-semibold">PF Deduction</span><span className="text-sm font-bold font-mono text-rose-600">₹{Number(salaryStructure.providentFund).toLocaleString()}</span></div>
            </div>
          )}
        </Card>
      </div>

      {/* Admin Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Employee — ${displayName}`}
        maxWidth="xl"
      >
        <form onSubmit={handleAdminUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Joining Date" type="date" required value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              required
              options={departments.map((d) => ({ label: d.name, value: d.id }))}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            />
            <Input label="Designation" required value={designation} onChange={(e) => setDesignation(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Reporting Manager"
              options={[
                { label: 'None (Direct Report)', value: '' },
                ...managers.filter((m) => m.id !== id).map((m) => ({ label: `${m.firstName} ${m.lastName} (${m.employeeId})`, value: m.id })),
              ]}
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <div className="grid grid-cols-4 gap-3">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
            <Input label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>Save Employee Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
