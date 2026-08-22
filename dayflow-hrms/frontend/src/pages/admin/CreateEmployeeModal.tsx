import React, { useEffect, useState } from 'react';
import { employeeService, CreateEmployeeParams } from '../../services/employeeService';
import { Department, Employee } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { CheckCircle2, UserPlus } from 'lucide-react';

export interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [managerId, setManagerId] = useState<string>('');
  const [location, setLocation] = useState<string>('San Francisco HQ');
  const [createdInfo, setCreatedInfo] = useState<{ employee: Employee; tempPassword?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCreatedInfo(null);
      const loadOptions = async () => {
        try {
          const [deptRes, empRes] = await Promise.all([
            employeeService.listDepartments(),
            employeeService.listEmployees({ limit: 100 }),
          ]);

          if (deptRes.success && deptRes.data?.departments) {
            setDepartments(deptRes.data.departments);
            if (deptRes.data.departments.length > 0) {
              setDepartmentId(deptRes.data.departments[0].id);
            }
          }

          if (empRes.success && empRes.data?.items) {
            setManagers(empRes.data.items);
          }
        } catch (err) {
          console.error('Error loading dropdown options:', err);
        }
      };

      loadOptions();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: CreateEmployeeParams = {
        firstName,
        lastName,
        email,
        phone,
        joiningDate,
        departmentId,
        designation,
        managerId: managerId || undefined,
        location,
      };

      const res = await employeeService.createEmployee(payload);
      if (res.success && res.data) {
        showToast(`Employee ${res.data.employee.firstName} created successfully!`, 'success');
        setCreatedInfo({
          employee: res.data.employee,
          tempPassword: res.data.tempPassword,
        });
        onSuccess();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create employee.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      description="Create a new employee record and user account."
      maxWidth="xl"
    >
      {createdInfo ? (
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 size={20} className="text-emerald-600" />
              Employee Account Successfully Provisioned!
            </div>
            <p className="text-xs text-slate-700">
              Employee ID <strong className="font-mono text-indigo-700">{createdInfo.employee.employeeId}</strong> generated automatically by system.
            </p>
            {createdInfo.tempPassword && (
              <div className="p-3 bg-white rounded-lg border border-emerald-200 font-mono text-xs space-y-1 mt-2">
                <p className="text-slate-500 text-[10px] uppercase font-semibold">Development Temporary Password:</p>
                <p className="text-indigo-700 font-bold select-all">{createdInfo.tempPassword}</p>
                <p className="text-[10px] text-slate-500 font-sans italic mt-1">
                  User will be forced to change this password on first login (`mustChangePassword = true`).
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
            <Input
              label="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@dayflow.tech"
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              required
              options={departments.map((d) => ({ label: d.name, value: d.id }))}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            />
            <Input
              label="Designation / Role Title"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Software Engineer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Reporting Manager"
              options={[
                { label: 'None (Direct Report)', value: '' },
                ...managers.map((m) => ({ label: `${m.firstName} ${m.lastName} (${m.employeeId})`, value: m.id })),
              ]}
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            />
            <Input
              label="Joining Date"
              type="date"
              required
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
            <Input
              label="Workplace Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco HQ"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
            <strong className="text-slate-700">System Employee ID:</strong> Will be auto-generated in business format (e.g. <code>DAYJD20260003</code>) by backend algorithm.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={loading} icon={<UserPlus size={16} />}>
              Create Employee
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
