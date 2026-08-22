import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, CheckCircle2, AlertCircle, X, Edit3, 
  Save, FileText, XCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { payrollService } from '../../data/mockPayroll';
import type { PayrollRecord, SalaryBreakdown } from '../../data/mockPayroll';
import { adminService } from '../../data/mockAdmin';

export const AdminPayroll: React.FC = () => {
  const navigate = useNavigate();

  // Period Selection
  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedYear, setSelectedYear] = useState('2026');
  const payPeriod = `${selectedMonth} ${selectedYear}`;

  // Data State
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState(payrollService.getPayrollSummary(payPeriod));
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Modal State
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Edit State
  const [editBreakdown, setEditBreakdown] = useState<SalaryBreakdown | null>(null);
  const [editStatus, setEditStatus] = useState<'Paid' | 'Pending' | 'Processing'>('Pending');
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const employees = adminService.getEmployees();
  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const refreshData = () => {
    setRecords(payrollService.getAllPayrollRecords(payPeriod));
    setSummary(payrollService.getPayrollSummary(payPeriod));
  };

  useEffect(() => {
    refreshData();
  }, [payPeriod]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Drawer Handlers
  const openDrawer = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setIsEditMode(false);
    setIsDrawerOpen(true);
  };

  const startEdit = () => {
    if (selectedRecord) {
      setEditBreakdown({ ...selectedRecord.breakdown });
      setEditStatus(selectedRecord.status);
      setIsEditMode(true);
    }
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditBreakdown(null);
  };

  // Edit Calculations
  const calculatedGross = editBreakdown ? 
    (editBreakdown.basic + editBreakdown.hra + editBreakdown.allowances + editBreakdown.bonus) : 0;
  
  const calculatedDeductions = editBreakdown ? 
    (editBreakdown.tax + editBreakdown.otherDeductions) : 0;
  
  const calculatedNet = calculatedGross - calculatedDeductions;
  
  const isInvalidCalculation = calculatedNet < 0;

  const handleFieldChange = (field: keyof SalaryBreakdown, value: string) => {
    if (!editBreakdown) return;
    const numValue = Math.max(0, parseInt(value) || 0); // Prevent negatives
    setEditBreakdown({ ...editBreakdown, [field]: numValue });
  };

  const handleSave = () => {
    if (selectedRecord && editBreakdown && !isInvalidCalculation) {
      payrollService.updatePayroll(selectedRecord.id, editBreakdown, editStatus);
      refreshData();
      setIsEditMode(false);
      showNotification('Payroll updated successfully.');
      
      // Update local selected record view without fully closing drawer
      setSelectedRecord(payrollService.getPayrollById(selectedRecord.id));
    }
  };

  // Filtered Records
  const filteredRecords = records.filter(req => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      req.employeeName.toLowerCase().includes(searchLower) ||
      req.employeeId.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesDept = deptFilter === 'All' || req.department === deptFilter;
    
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300 px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Payroll</h1>
          <p className="text-slate-500 mt-1">Manage employee salary structures and payroll records.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-slate-700"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {['August', 'July', 'June', 'May', 'April', 'March'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none bg-white text-slate-700"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Employees</p>
          <p className="text-2xl font-black text-slate-900">{summary.totalEmployees}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Gross</p>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(summary.totalGross)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Total Deductions</p>
          <p className="text-2xl font-black text-red-700">{formatCurrency(summary.totalDeductions)}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Net Payroll</p>
          <p className="text-2xl font-black text-emerald-700">{formatCurrency(summary.totalNet)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search employee or ID..." 
            className="pl-9 pr-8 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            className="px-3 py-2 w-full md:w-48 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
          
          <select 
            className="px-3 py-2 w-full md:w-36 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Basic / Allowances</th>
                <th className="px-6 py-4">Deductions</th>
                <th className="px-6 py-4">Gross Salary</th>
                <th className="px-6 py-4 font-black">Net Salary</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{req.employeeName}</p>
                    <p className="text-xs text-slate-500">{req.employeeId} • {req.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{formatCurrency(req.breakdown.basic)}</p>
                    <p className="text-xs text-slate-500">Allws: {formatCurrency(req.breakdown.allowances + req.breakdown.hra + req.breakdown.bonus)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-red-600">
                    {formatCurrency(req.totalDeductions)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {formatCurrency(req.grossSalary)}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600">
                    {formatCurrency(req.netSalary)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" className="text-xs py-1.5 px-3" onClick={() => openDrawer(req)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-medium mb-2">No payroll records found for this criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filteredRecords.map(req => (
            <div key={req.id} className="p-4 bg-white hover:bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900">{req.employeeName}</p>
                  <p className="text-xs text-slate-500">{req.employeeId} • {req.department}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold tracking-wide">Gross</span>
                  <span className="font-bold text-slate-700">{formatCurrency(req.grossSalary)}</span>
                </div>
                <div>
                  <span className="text-xs text-emerald-600 block uppercase font-bold tracking-wide">Net Pay</span>
                  <span className="font-black text-emerald-700">{formatCurrency(req.netSalary)}</span>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" className="w-full text-sm py-2" onClick={() => openDrawer(req)}>Manage Payroll</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail & Edit Drawer */}
      {isDrawerOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-900">
                {isEditMode ? 'Edit Salary Structure' : 'Payroll Details'}
              </h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Profile Header */}
              <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedRecord.employeeName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{selectedRecord.employeeName}</h3>
                  <div className="flex items-center space-x-2 mt-1 mb-2">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedRecord.employeeId}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedRecord.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-500">Period: {selectedRecord.payPeriod}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(selectedRecord.status)}`}>
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>
              </div>

              {!isEditMode ? (
                /* View Mode */
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Earnings */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Earnings</h4>
                    <div className="bg-slate-50 rounded-lg border border-slate-100 p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Basic Salary</span>
                        <span className="font-medium text-slate-900">{formatCurrency(selectedRecord.breakdown.basic)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">House Rent Allowance (HRA)</span>
                        <span className="font-medium text-slate-900">{formatCurrency(selectedRecord.breakdown.hra)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Allowances</span>
                        <span className="font-medium text-slate-900">{formatCurrency(selectedRecord.breakdown.allowances)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Bonus</span>
                        <span className="font-medium text-slate-900">{formatCurrency(selectedRecord.breakdown.bonus)}</span>
                      </div>
                      <div className="pt-3 border-t border-slate-200 flex justify-between font-bold">
                        <span className="text-slate-900">Gross Salary</span>
                        <span className="text-slate-900">{formatCurrency(selectedRecord.grossSalary)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Deductions</h4>
                    <div className="bg-red-50 rounded-lg border border-red-100 p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Tax</span>
                        <span className="font-medium text-red-900">{formatCurrency(selectedRecord.breakdown.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Other Deductions</span>
                        <span className="font-medium text-red-900">{formatCurrency(selectedRecord.breakdown.otherDeductions)}</span>
                      </div>
                      <div className="pt-3 border-t border-red-200 flex justify-between font-bold">
                        <span className="text-red-900">Total Deductions</span>
                        <span className="text-red-900">{formatCurrency(selectedRecord.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="bg-emerald-600 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
                    <div>
                      <h4 className="text-emerald-100 font-medium uppercase tracking-wide text-xs mb-1">Net Salary</h4>
                      <p className="text-3xl font-black">{formatCurrency(selectedRecord.netSalary)}</p>
                    </div>
                    <FileText className="w-10 h-10 text-emerald-400 opacity-50" />
                  </div>

                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  
                  {isInvalidCalculation && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 text-red-800 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p><strong>Invalid Calculation:</strong> Net Salary cannot be negative. Please adjust deductions or earnings.</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Basic Salary (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                        value={editBreakdown?.basic || 0}
                        onChange={(e) => handleFieldChange('basic', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">HRA (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                        value={editBreakdown?.hra || 0}
                        onChange={(e) => handleFieldChange('hra', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Allowances (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                        value={editBreakdown?.allowances || 0}
                        onChange={(e) => handleFieldChange('allowances', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bonus (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-medium"
                        value={editBreakdown?.bonus || 0}
                        onChange={(e) => handleFieldChange('bonus', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tax Deductions (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none font-medium"
                        value={editBreakdown?.tax || 0}
                        onChange={(e) => handleFieldChange('tax', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Other Deductions (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-600 outline-none font-medium"
                        value={editBreakdown?.otherDeductions || 0}
                        onChange={(e) => handleFieldChange('otherDeductions', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Payroll Status</label>
                    <select 
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none font-medium bg-white"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                    </select>
                  </div>

                  {/* Live Calculation Preview */}
                  <div className="bg-slate-900 rounded-xl p-5 text-white space-y-3 mt-6 shadow-md">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Payroll Summary</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Gross Salary</span>
                      <span className="font-medium">{formatCurrency(calculatedGross)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-400">Total Deductions</span>
                      <span className="font-medium text-red-400">-{formatCurrency(calculatedDeductions)}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Net Salary</span>
                      <span className={`text-xl font-black ${isInvalidCalculation ? 'text-red-500' : 'text-emerald-400'}`}>
                        {formatCurrency(calculatedNet)}
                      </span>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0">
              {!isEditMode ? (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/employee/payroll/${selectedRecord.id}/slip`)}>
                    View Salary Slip
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={startEdit}>
                    <Edit3 className="w-4 h-4 mr-2 inline" /> Edit Salary
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" 
                    onClick={handleSave}
                    disabled={isInvalidCalculation}
                  >
                    <Save className="w-4 h-4 mr-2 inline" /> Save Changes
                  </Button>
                </>
              )}
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};
