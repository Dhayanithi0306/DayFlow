import React, { useState, useEffect } from 'react';
import { SalaryStructure } from '../../types';
import { payrollService, UpdateSalaryParams } from '../../services/payrollService';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { Save, Layers } from 'lucide-react';

export interface SalaryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  currentStructure?: SalaryStructure | null;
  onSuccess: () => void;
}

export const SalaryEditModal: React.FC<SalaryEditModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  currentStructure,
  onSuccess,
}) => {
  const { showToast } = useToast();

  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [hra, setHra] = useState<number>(10000);
  const [standardAllowance, setStandardAllowance] = useState<number>(5000);
  const [performanceBonus, setPerformanceBonus] = useState<number>(3000);
  const [leaveTravelAllowance, setLeaveTravelAllowance] = useState<number>(2000);
  const [fixedAllowance, setFixedAllowance] = useState<number>(5000);

  const [providentFund, setProvidentFund] = useState<number>(3000);
  const [professionalTax, setProfessionalTax] = useState<number>(500);

  const [currency, setCurrency] = useState<string>('INR');
  const todayStr = new Date().toISOString().split('T')[0];
  const [effectiveFrom, setEffectiveFrom] = useState<string>(todayStr);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentStructure) {
      setBasicSalary(Number(currentStructure.basicSalary) || 0);
      setHra(Number(currentStructure.hra) || 0);
      setStandardAllowance(Number(currentStructure.standardAllowance) || 0);
      setPerformanceBonus(Number(currentStructure.performanceBonus) || 0);
      setLeaveTravelAllowance(Number(currentStructure.leaveTravelAllowance) || 0);
      setFixedAllowance(Number(currentStructure.fixedAllowance) || 0);
      setProvidentFund(Number(currentStructure.providentFund) || 0);
      setProfessionalTax(Number(currentStructure.professionalTax) || 0);
      setCurrency(currentStructure.currency || 'INR');
      setEffectiveFrom(currentStructure.effectiveFrom ? new Date(currentStructure.effectiveFrom).toISOString().split('T')[0] : todayStr);
    }
  }, [currentStructure]);

  // Live frontend calculations preview
  const grossPreview = basicSalary + hra + standardAllowance + performanceBonus + leaveTravelAllowance + fixedAllowance;
  const deductionsPreview = providentFund + professionalTax;
  const netPreview = Math.max(0, grossPreview - deductionsPreview);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: UpdateSalaryParams = {
        basicSalary,
        hra,
        standardAllowance,
        performanceBonus,
        leaveTravelAllowance,
        fixedAllowance,
        providentFund,
        professionalTax,
        currency,
        effectiveFrom,
      };

      const res = await payrollService.updateEmployeeSalary(employeeId, payload);
      if (res.success) {
        showToast('New salary structure version created successfully.', 'success');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update salary structure.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Salary Structure — ${employeeName}`}
      description="Creating a new salary structure will preserve previous historical versions."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Live Calculation Preview Banner */}
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Gross Salary</span>
            <span className="text-sm font-bold font-mono text-slate-900">{formatCurrency(grossPreview, currency)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Deductions</span>
            <span className="text-sm font-bold font-mono text-rose-600">-{formatCurrency(deductionsPreview, currency)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-indigo-700 block">Net Payable</span>
            <span className="text-sm font-extrabold font-mono text-emerald-700">{formatCurrency(netPreview, currency)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Effective From Date"
            type="date"
            required
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
          />
          <Select
            label="Currency"
            options={[
              { label: 'INR (₹)', value: 'INR' },
              { label: 'USD ($)', value: 'USD' },
            ]}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>

        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pt-2 border-t border-slate-100">
          Earnings Components
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Input
            label="Basic Salary"
            type="number"
            required
            value={basicSalary}
            onChange={(e) => setBasicSalary(Number(e.target.value))}
          />
          <Input
            label="HRA"
            type="number"
            value={hra}
            onChange={(e) => setHra(Number(e.target.value))}
          />
          <Input
            label="Standard Allowance"
            type="number"
            value={standardAllowance}
            onChange={(e) => setStandardAllowance(Number(e.target.value))}
          />
          <Input
            label="Performance Bonus"
            type="number"
            value={performanceBonus}
            onChange={(e) => setPerformanceBonus(Number(e.target.value))}
          />
          <Input
            label="LTA"
            type="number"
            value={leaveTravelAllowance}
            onChange={(e) => setLeaveTravelAllowance(Number(e.target.value))}
          />
          <Input
            label="Fixed Allowance"
            type="number"
            value={fixedAllowance}
            onChange={(e) => setFixedAllowance(Number(e.target.value))}
          />
        </div>

        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider pt-2 border-t border-slate-100">
          Deductions Components
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Provident Fund (PF)"
            type="number"
            value={providentFund}
            onChange={(e) => setProvidentFund(Number(e.target.value))}
          />
          <Input
            label="Professional Tax"
            type="number"
            value={professionalTax}
            onChange={(e) => setProfessionalTax(Number(e.target.value))}
          />
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
          <Layers size={16} className="text-indigo-600 shrink-0" />
          <span>Backend recalculates authoritative totals and preserves historical salary structures.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading} icon={<Save size={16} />}>
            Save Salary Structure
          </Button>
        </div>
      </form>
    </Modal>
  );
};
