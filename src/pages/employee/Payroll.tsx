import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Banknote, TrendingDown, Wallet, Calendar, 
  CheckCircle2, Clock, AlertCircle, FileText, ChevronRight, Lock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { payrollService } from '../../data/mockPayroll';
import type { PayrollRecord, PaymentStatus } from '../../data/mockPayroll';

export const EmployeePayrollPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPayroll, setCurrentPayroll] = useState<PayrollRecord | null>(null);
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    // Load mock data
    setCurrentPayroll(payrollService.getMyPayroll());
    setPayrollHistory(payrollService.getPayrollHistory());
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusStyle = (status: PaymentStatus) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch(status) {
      case 'Paid': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'Processing': return <Clock className="w-4 h-4 mr-1.5" />;
      case 'Pending': return <AlertCircle className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  if (!currentPayroll) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Payroll</h1>
          <p className="text-slate-500 mt-1">View your salary details and payroll history.</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Current Pay Period</p>
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold text-slate-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> {currentPayroll.payPeriod}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusStyle(currentPayroll.status)}`}>
              {getStatusIcon(currentPayroll.status)}
              Status: {currentPayroll.status}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shrink-0">
            <Banknote className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gross Salary</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(currentPayroll.grossSalary)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shrink-0">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Deductions</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(currentPayroll.totalDeductions)}</p>
          </div>
        </div>
        <div className="bg-indigo-600 p-6 rounded-xl border border-indigo-700 shadow-md flex items-center space-x-4 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/30 shrink-0">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">Net Salary</p>
            <p className="text-3xl font-black text-white tracking-tight">{formatCurrency(currentPayroll.netSalary)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Salary Breakdown (Read-Only) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Salary Breakdown
              </h2>
              <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold flex items-center border border-slate-200">
                <Lock className="w-3 h-3 mr-1" /> Read Only
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              
              <div className="space-y-4 mb-6 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(currentPayroll.breakdown.basic)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">HRA</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(currentPayroll.breakdown.hra)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Allowances</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(currentPayroll.breakdown.allowances)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">Bonus</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(currentPayroll.breakdown.bonus)}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">Gross Salary</span>
                  <span className="font-bold text-slate-900">{formatCurrency(currentPayroll.grossSalary)}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6 bg-red-50/50 p-4 rounded-lg border border-red-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-800">Tax / Deductions</span>
                  <span className="font-semibold text-red-700">-{formatCurrency(currentPayroll.breakdown.tax)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-800">Other Deductions</span>
                  <span className="font-semibold text-red-700">-{formatCurrency(currentPayroll.breakdown.otherDeductions)}</span>
                </div>
                <div className="border-t border-red-200 pt-3 flex justify-between items-center mt-3">
                  <span className="text-sm font-bold text-red-900">Total Deductions</span>
                  <span className="font-bold text-red-700">-{formatCurrency(currentPayroll.totalDeductions)}</span>
                </div>
              </div>

              <div className="border-t-2 border-indigo-100 pt-5 flex justify-between items-center mt-auto">
                <span className="text-base font-black text-indigo-900">Net Salary</span>
                <span className="text-xl font-black text-indigo-700">{formatCurrency(currentPayroll.netSalary)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> Payroll History
              </h2>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Pay Period</th>
                    <th className="px-6 py-4 text-right">Gross Salary</th>
                    <th className="px-6 py-4 text-right">Deductions</th>
                    <th className="px-6 py-4 text-right">Net Salary</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payrollHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{record.payPeriod}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-600">{formatCurrency(record.grossSalary)}</td>
                      <td className="px-6 py-4 text-right font-medium text-red-600">-{formatCurrency(record.totalDeductions)}</td>
                      <td className="px-6 py-4 text-right font-bold text-indigo-600">{formatCurrency(record.netSalary)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="outline" 
                          className="text-xs py-1.5 px-3"
                          onClick={() => navigate(`/employee/payroll/${record.id}/slip`)}
                        >
                          View Slip
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {payrollHistory.map((record) => (
                <div key={record.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-slate-900 text-lg">{record.payPeriod}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <span className="block text-xs text-slate-500">Gross</span>
                      <span className="font-medium text-slate-900">{formatCurrency(record.grossSalary)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500">Net</span>
                      <span className="font-bold text-indigo-600">{formatCurrency(record.netSalary)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-sm mt-2 flex justify-center items-center"
                    onClick={() => navigate(`/employee/payroll/${record.id}/slip`)}
                  >
                    View Salary Slip <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
