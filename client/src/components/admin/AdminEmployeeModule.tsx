import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { EmployeeRecord, Role } from '../../types/hrms';
import { Search, Filter, Plus, Eye, Edit3, ShieldCheck, Sparkles } from 'lucide-react';

export const AdminEmployeeModule: React.FC = () => {
  const { employees, addEmployee, updateEmployee } = useHRMS();
  const { generateSystemLoginId } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals state
  const [selectedEmp, setSelectedEmp] = useState<EmployeeRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit form state
  const [editDesignation, setEditDesignation] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editRole, setEditRole] = useState<Role>('employee');
  const [editBaseSalary, setEditBaseSalary] = useState<number>(0);

  // Add form state
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addDesignation, setAddDesignation] = useState('');
  const [addDepartment, setAddDepartment] = useState('Engineering');
  const [addRole, setAddRole] = useState<Role>('employee');
  const [addBasicSalary, setAddBasicSalary] = useState(5000);

  const previewLoginId = addName ? generateSystemLoginId(addName) : 'DAYXX20260000';

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenEdit = (emp: EmployeeRecord) => {
    setSelectedEmp(emp);
    setEditDesignation(emp.designation);
    setEditDepartment(emp.department);
    setEditRole(emp.role);
    setEditBaseSalary(emp.salaryStructure?.basicSalary || emp.baseSalary || 5000);
    setIsEditModalOpen(true);
  };

  const handleOpenView = (emp: EmployeeRecord) => {
    setSelectedEmp(emp);
    setIsViewModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const struct = selectedEmp.salaryStructure || {
      basicSalary: editBaseSalary,
      hra: 1800,
      standardAllowance: 500,
      performanceBonus: 800,
      lta: 400,
      fixedAllowance: 600,
      pfDeduction: 540,
      taxDeduction: 260,
      netSalary: editBaseSalary + 3100,
    };

    const updated: EmployeeRecord = {
      ...selectedEmp,
      designation: editDesignation,
      department: editDepartment,
      role: editRole,
      salaryStructure: {
        ...struct,
        basicSalary: editBaseSalary,
      },
    };

    updateEmployee(updated);
    setIsEditModalOpen(false);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      name: addName,
      email: addEmail,
      phone: addPhone || '+1 (555) 000-1122',
      department: addDepartment,
      designation: addDesignation,
      role: addRole,
      basicSalary: addBasicSalary,
    });

    setAddName('');
    setAddEmail('');
    setAddPhone('');
    setAddDesignation('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory & Management"
        subtitle="Search, filter, view employee files, edit designations, and issue system-generated Login IDs."
        breadcrumbs={[{ label: 'Management' }, { label: 'Employees' }]}
        action={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
            Create New Employee
          </Button>
        }
      />

      <Card>
        {/* Search & Department Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by System Login ID, name, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Employee Name</th>
                <th className="py-3 px-4">System Login ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => handleOpenView(emp)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200" />
                    <div>
                      <p className="font-bold text-slate-900">{emp.name}</p>
                      <p className="text-[11px] font-mono text-slate-400">{emp.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">{emp.loginId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{emp.department}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.designation}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.role === 'admin'
                          ? 'bg-violet-100 text-violet-800 border border-violet-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {emp.role === 'admin' && <ShieldCheck className="h-3 w-3 text-violet-600" />}
                      {emp.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    ${(emp.salaryStructure?.netSalary || emp.netSalary || 7800).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Eye className="h-3.5 w-3.5" />}
                      onClick={() => handleOpenView(emp)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Edit3 className="h-3.5 w-3.5 text-indigo-600" />}
                      onClick={() => handleOpenEdit(emp)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Details Modal */}
      {selectedEmp && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Employee Details: ${selectedEmp.name}`}
          subtitle={`System Login ID: ${selectedEmp.loginId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <img src={selectedEmp.avatar} alt={selectedEmp.name} className="h-14 w-14 rounded-xl object-cover" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedEmp.name}</h4>
                <p className="text-indigo-600 font-semibold">{selectedEmp.email}</p>
                <p className="text-slate-500">Joined on {selectedEmp.joiningDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-slate-100 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Department</span>
                <p className="font-bold text-slate-900">{selectedEmp.department}</p>
              </div>
              <div className="p-3 border border-slate-100 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Designation</span>
                <p className="font-bold text-slate-900">{selectedEmp.designation}</p>
              </div>
            </div>

            <div className="p-3 border border-slate-100 rounded-xl space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Salary Summary</span>
              <div className="flex justify-between">
                <span>Basic Salary:</span>
                <span className="font-bold">${(selectedEmp.salaryStructure?.basicSalary || selectedEmp.baseSalary || 4500).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Net Pay:</span>
                <span className="font-extrabold">${(selectedEmp.salaryStructure?.netSalary || selectedEmp.netSalary || 7800).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Employee Modal */}
      {selectedEmp && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Employee: ${selectedEmp.name}`}
          subtitle={`System Login ID: ${selectedEmp.loginId}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <select
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">HR Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Basic Salary ($)</label>
                <input
                  type="number"
                  required
                  value={editBaseSalary}
                  onChange={(e) => setEditBaseSalary(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Record
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create New Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Employee"
        subtitle="Generates a unique System Login ID and temporary password."
      >
        <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
          {addName && (
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Auto-Generated System Login ID
                </span>
                <span className="font-mono font-black text-sm text-indigo-700 block mt-0.5">{previewLoginId}</span>
              </div>
              <span className="text-[10px] bg-white px-2 py-1 rounded font-bold text-indigo-700 border">
                Temp Pass: DAYFLOW2026!
              </span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Employee Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Amanda Hayes"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                placeholder="amanda@dayflow.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-1122"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <select
                value={addDepartment}
                onChange={(e) => setAddDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Engineering">Engineering</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                placeholder="Software Engineer"
                value={addDesignation}
                onChange={(e) => setAddDesignation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Role</label>
              <select
                value={addRole}
                onChange={(e) => setAddRole(e.target.value as Role)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="employee">Employee</option>
                <option value="admin">HR Admin</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Basic Salary ($)</label>
              <input
                type="number"
                required
                value={addBasicSalary}
                onChange={(e) => setAddBasicSalary(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Issue System Login ID & Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
