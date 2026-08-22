import React, { useState } from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { EmployeeRecord, DetailedSalaryStructure } from '../../types/hrms';
import { Edit3, Filter, Search, ShieldCheck } from 'lucide-react';

export const AdminPayrollModule: React.FC = () => {
  const { employees, updateSalaryStructure } = useHRMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Edit salary state
  const [selectedEmp, setSelectedEmp] = useState<EmployeeRecord | null>(null);
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

  const [basicSalary, setBasicSalary] = useState(4500);
  const [hra, setHra] = useState(1800);
  const [standardAllowance, setStandardAllowance] = useState(500);
  const [performanceBonus, setPerformanceBonus] = useState(800);
  const [lta, setLta] = useState(400);
  const [fixedAllowance, setFixedAllowance] = useState(600);
  const [pfDeduction, setPfDeduction] = useState(540);
  const [taxDeduction, setTaxDeduction] = useState(260);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalPayrollCost = employees.reduce((acc, curr) => {
    const net = curr.salaryStructure?.netSalary ?? curr.netSalary ?? 7800;
    return acc + net;
  }, 0);

  const handleOpenSalaryEdit = (emp: EmployeeRecord) => {
    setSelectedEmp(emp);
    const struct = emp.salaryStructure || {
      basicSalary: emp.baseSalary || 4500,
      hra: 1800,
      standardAllowance: 500,
      performanceBonus: 800,
      lta: 400,
      fixedAllowance: 600,
      pfDeduction: 540,
      taxDeduction: 260,
      netSalary: emp.netSalary || 7800,
    };

    setBasicSalary(struct.basicSalary);
    setHra(struct.hra);
    setStandardAllowance(struct.standardAllowance);
    setPerformanceBonus(struct.performanceBonus);
    setLta(struct.lta);
    setFixedAllowance(struct.fixedAllowance);
    setPfDeduction(struct.pfDeduction);
    setTaxDeduction(struct.taxDeduction);
    setIsSalaryModalOpen(true);
  };

  const calculatedTotalAllowances = hra + standardAllowance + performanceBonus + lta + fixedAllowance;
  const calculatedTotalDeductions = pfDeduction + taxDeduction;
  const calculatedNetSalary = basicSalary + calculatedTotalAllowances - calculatedTotalDeductions;

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    const newStructure: DetailedSalaryStructure = {
      basicSalary,
      hra,
      standardAllowance,
      performanceBonus,
      lta,
      fixedAllowance,
      pfDeduction,
      taxDeduction,
      netSalary: calculatedNetSalary,
    };

    updateSalaryStructure(selectedEmp.id, newStructure);
    setIsSalaryModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary & Payroll Structure Management"
        subtitle="Manage detailed salary components: Basic Salary, HRA, LTA, Performance Bonus, PF, and Tax deductions."
        breadcrumbs={[{ label: 'Management' }, { label: 'Salary Management' }]}
      />

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">August 2026 Total Net Payout</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            ${totalPayrollCost.toLocaleString()}
          </div>
          <p className="text-xs text-slate-300 mt-1">Calculated across {employees.length} active employees.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Finance Approval Status: Verified</span>
        </div>
      </div>

      <Card>
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by System Login ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
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

        {/* Salary Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Login ID</th>
                <th className="py-3 px-4">Basic Salary</th>
                <th className="py-3 px-4">Allowances (HRA/LTA/Bonus)</th>
                <th className="py-3 px-4">Deductions (PF/Tax)</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const struct = emp.salaryStructure || {
                  basicSalary: 4500,
                  hra: 1800,
                  standardAllowance: 500,
                  performanceBonus: 800,
                  lta: 400,
                  fixedAllowance: 600,
                  pfDeduction: 540,
                  taxDeduction: 260,
                  netSalary: 7800,
                };
                const totalAllowances = struct.hra + struct.standardAllowance + struct.performanceBonus + struct.lta + struct.fixedAllowance;
                const totalDeductions = struct.pfDeduction + struct.taxDeduction;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{emp.name}</td>
                    <td className="py-3 px-4 font-mono text-indigo-700 font-bold">{emp.loginId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">${struct.basicSalary.toLocaleString()}</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">+${totalAllowances.toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-medium">-${totalDeductions.toLocaleString()}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">${struct.netSalary.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Edit3 className="h-3.5 w-3.5 text-indigo-600" />}
                        onClick={() => handleOpenSalaryEdit(emp)}
                      >
                        Edit Structure
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Salary Structure Editor Modal */}
      {selectedEmp && (
        <Modal
          isOpen={isSalaryModalOpen}
          onClose={() => setIsSalaryModalOpen(false)}
          title={`Edit Salary Structure: ${selectedEmp.name}`}
          subtitle={`System Login ID: ${selectedEmp.loginId}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveSalary} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Basic Salary ($)</label>
              <input
                type="number"
                required
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Allowances */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-900 border-b border-emerald-200 pb-1">Allowances ($)</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">House Rent Allowance (HRA)</label>
                  <input
                    type="number"
                    value={hra}
                    onChange={(e) => setHra(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Standard Allowance</label>
                  <input
                    type="number"
                    value={standardAllowance}
                    onChange={(e) => setStandardAllowance(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Performance Bonus</label>
                  <input
                    type="number"
                    value={performanceBonus}
                    onChange={(e) => setPerformanceBonus(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Leave Travel Allowance (LTA)</label>
                  <input
                    type="number"
                    value={lta}
                    onChange={(e) => setLta(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Fixed Allowance</label>
                  <input
                    type="number"
                    value={fixedAllowance}
                    onChange={(e) => setFixedAllowance(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-emerald-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Deductions */}
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
                <h4 className="font-bold text-rose-900 border-b border-rose-200 pb-1">Deductions ($)</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Provident Fund (PF)</label>
                  <input
                    type="number"
                    value={pfDeduction}
                    onChange={(e) => setPfDeduction(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-rose-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Professional / Income Tax</label>
                  <input
                    type="number"
                    value={taxDeduction}
                    onChange={(e) => setTaxDeduction(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-rose-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Preview Banner */}
            <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Recalculated Net Salary</span>
                <div className="text-xl font-extrabold text-emerald-400">${calculatedNetSalary.toLocaleString()}</div>
              </div>
              <span className="text-[11px] text-slate-400">
                +${calculatedTotalAllowances} allowances • -${calculatedTotalDeductions} deductions
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="secondary" type="button" onClick={() => setIsSalaryModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Salary Structure
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
