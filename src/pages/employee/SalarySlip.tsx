import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Building } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { payrollService } from '../../data/mockPayroll';
import type { PayrollRecord } from '../../data/mockPayroll';
import { useAuth } from '../../context/AuthContext';
import { MOCK_EMPLOYEE_PROFILE } from '../../data/mockProfile'; // reuse for employee details

export const SalarySlipPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [payroll, setPayroll] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    if (id) {
      const record = payrollService.getPayrollById(id);
      if (record) {
        setPayroll(record);
      } else {
        navigate('/employee/payroll');
      }
    }
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!payroll) return null;

  return (
    <div className="max-w-4xl mx-auto py-6 print:py-0">
      
      {/* Non-printable Action Bar */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <Button variant="outline" onClick={() => navigate('/employee/payroll')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Payroll
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Salary Slip
          </Button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0">
        
        {/* Slip Header */}
        <div className="p-8 border-b-2 border-indigo-600 bg-slate-50 print:bg-white flex justify-between items-start">
          <div>
            <div className="flex items-center text-indigo-700 font-black text-2xl tracking-tight mb-1">
              <Building className="w-6 h-6 mr-2" /> DAYFLOW
            </div>
            <p className="text-slate-500 text-sm font-medium">Every workday, perfectly aligned.</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Salary Slip</h2>
            <p className="text-slate-600 font-medium mt-1">{payroll.payPeriod}</p>
          </div>
        </div>

        {/* Employee Details */}
        <div className="p-8 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Employee Name</p>
              <p className="font-semibold text-slate-900">{currentUser?.name || MOCK_EMPLOYEE_PROFILE.firstName + ' ' + MOCK_EMPLOYEE_PROFILE.lastName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Employee ID</p>
              <p className="font-semibold text-slate-900">{MOCK_EMPLOYEE_PROFILE.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
              <p className="font-semibold text-slate-900">{MOCK_EMPLOYEE_PROFILE.department}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Designation</p>
              <p className="font-semibold text-slate-900">{MOCK_EMPLOYEE_PROFILE.designation}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Date</p>
              <p className="font-semibold text-slate-900">{payroll.paymentDate}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Status</p>
              <p className="font-semibold text-emerald-600">{payroll.status}</p>
            </div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-8">
            
            {/* Earnings */}
            <div>
              <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider text-sm">Earnings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Basic Salary</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(payroll.breakdown.basic)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">HRA</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(payroll.breakdown.hra)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Allowances</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(payroll.breakdown.allowances)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Bonus</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(payroll.breakdown.bonus)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider text-sm">Deductions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Tax / TDS</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(payroll.breakdown.tax)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 font-medium">Other Deductions</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(payroll.breakdown.otherDeductions)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="px-8 pb-8 pt-4">
          <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">Gross Earnings</span>
              <span className="font-bold text-slate-900">{formatCurrency(payroll.grossSalary)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">Total Deductions</span>
              <span className="font-bold text-red-600">-{formatCurrency(payroll.totalDeductions)}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex justify-between items-center print:bg-white print:border-2 print:border-slate-800">
            <span className="text-xl font-bold text-slate-900 uppercase tracking-widest">Net Salary</span>
            <span className="text-3xl font-black text-indigo-700 print:text-black">{formatCurrency(payroll.netSalary)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50 text-center print:bg-white print:border-none">
          <p className="text-xs text-slate-400 font-medium">
            This is a computer-generated document. No signature is required.
          </p>
        </div>

      </div>
    </div>
  );
};
