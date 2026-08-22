import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Download, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PayrollModule: React.FC = () => {
  const { currentUser, addToast } = useHRMS();

  const salary = currentUser?.salaryStructure || {
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

  const totalAllowances = salary.hra + salary.standardAllowance + salary.performanceBonus + salary.lta + salary.fixedAllowance;
  const totalDeductions = salary.pfDeduction + salary.taxDeduction;

  const handleDownload = () => {
    addToast('Payslip PDF downloaded to your local downloads folder.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary & Payroll Information"
        subtitle="View your monthly earnings breakdown, deductions, and download payslips."
        breadcrumbs={[{ label: 'Self Service' }, { label: 'Payroll' }]}
        action={
          <Button variant="outline" onClick={handleDownload} icon={<Download className="h-4 w-4" />}>
            Download Payslip (August 2026)
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Official Salary Breakdown (August 2026)">
          <div className="space-y-6 text-xs">
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Monthly Net Salary</span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">
                  ${salary.netSalary.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-slate-200">Status: Paid on Aug 30</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between border-b border-emerald-100 pb-2">
                  <span>Gross Earnings</span>
                  <span className="text-emerald-700">+${(salary.basicSalary + totalAllowances).toLocaleString()}</span>
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span className="font-semibold text-slate-900">${salary.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-semibold text-slate-900">${salary.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Allowance</span>
                    <span className="font-semibold text-slate-900">${salary.standardAllowance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance Bonus</span>
                    <span className="font-semibold text-slate-900">${salary.performanceBonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leave Travel Allowance (LTA)</span>
                    <span className="font-semibold text-slate-900">${salary.lta.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between border-b border-rose-100 pb-2">
                  <span>Deductions</span>
                  <span className="text-rose-700">-${totalDeductions.toLocaleString()}</span>
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Provident Fund (PF)</span>
                    <span className="font-semibold text-slate-900">${salary.pfDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Professional / Income Tax</span>
                    <span className="font-semibold text-slate-900">${salary.taxDeduction.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Direct Deposit Bank Account">
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center gap-3">
                <Building className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-900">{currentUser?.bankDetails.bankName}</p>
                  <p className="text-slate-500 font-mono">{currentUser?.bankDetails.accountNo}</p>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Routing / IFSC</span>
                <span className="font-mono font-semibold text-slate-900">{currentUser?.bankDetails.ifsc}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Account Status</span>
                <span className="font-semibold text-emerald-600">Verified</span>
              </div>
            </div>
          </Card>

          <Card title="Tax & PF Declaration">
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Form 16 Tax Statement Generated</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Your annual tax investment declaration for FY 2025-2026 has been verified by the HR finance team.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
