import React, { useState } from 'react';
import { 
  Clock, Calendar, Wallet, Users, 
  Download, Printer, Search 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

import { adminService } from '../../data/mockAdmin';
import { leaveService } from '../../data/mockLeave';
import { payrollService } from '../../data/mockPayroll';

// --- Utility for CSV Export ---
const exportToCsv = (filename: string, rows: object[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell: any = row[k as keyof typeof row] === null || row[k as keyof typeof row] === undefined ? '' : row[k as keyof typeof row];
        cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
        if (cell.search(/("|,|\n)/g) >= 0) {
          cell = `"${cell}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

type ReportType = 'attendance' | 'leave' | 'payroll' | 'employees';

export const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportType>('attendance');
  
  const employees = adminService.getEmployees();
  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  // Filters State
  const [deptFilter, setDeptFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('August');
  const [yearFilter, setYearFilter] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // ----------------------------------------------------
  // ATTENDANCE REPORT LOGIC
  // ----------------------------------------------------
  const renderAttendanceReport = () => {
    // Generate derived attendance report per employee for selected period
    // Since mockAttendance doesn't perfectly isolate by month historically, we will use total stats 
    // mapped to employees from the adminService to match the Dayflow requirements.
    
    // In a real app we'd fetch stats for this specific month. We'll simulate it with existing mock summary.
    let reportData = employees.map(emp => {
      // Mocking different stats based on employee ID hash to look realistic
      const hash = emp.id.charCodeAt(emp.id.length - 1);
      const present = 20 - (hash % 3);
      const absent = hash % 2;
      const leave = hash % 2;
      const half = hash % 1;
      const totalDays = present + absent + leave + half;
      const pct = Math.round((present / totalDays) * 100);

      return {
        name: emp.name,
        id: emp.id,
        dept: emp.department,
        present,
        absent,
        half,
        leave,
        pct
      };
    });

    if (deptFilter !== 'All') reportData = reportData.filter(d => d.dept === deptFilter);
    if (searchQuery) reportData = reportData.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalEmployees = reportData.length;
    const totalPresent = reportData.reduce((s, r) => s + r.present, 0);
    const totalAbsent = reportData.reduce((s, r) => s + r.absent, 0);
    const avgPct = totalEmployees ? Math.round(reportData.reduce((s, r) => s + r.pct, 0) / totalEmployees) : 0;

    const exportCsv = () => {
      exportToCsv(`Attendance_Report_${monthFilter}_${yearFilter}.csv`, reportData.map(r => ({
        'Employee': r.name,
        'Employee ID': r.id,
        'Department': r.dept,
        'Present': r.present,
        'Absent': r.absent,
        'Half Days': r.half,
        'Leave Days': r.leave,
        'Attendance %': `${r.pct}%`
      })));
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center print-hidden">
          <h2 className="text-lg font-bold text-slate-900">Attendance Report - {monthFilter} {yearFilter}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-xs py-1.5 px-3" onClick={exportCsv}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
            <Button variant="primary" className="text-xs py-1.5 px-3" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Employees</p>
            <p className="text-2xl font-black text-slate-900">{totalEmployees}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Present Days</p>
            <p className="text-2xl font-black text-emerald-700">{totalPresent}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Total Absent Days</p>
            <p className="text-2xl font-black text-red-700">{totalAbsent}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Avg Attendance</p>
            <p className="text-2xl font-black text-indigo-700">{avgPct}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-center">Present</th>
                  <th className="px-6 py-4 text-center">Absent</th>
                  <th className="px-6 py-4 text-center">Half-day</th>
                  <th className="px-6 py-4 text-center">Leave</th>
                  <th className="px-6 py-4 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.dept}</td>
                    <td className="px-6 py-4 text-sm text-center font-medium text-emerald-600">{r.present}</td>
                    <td className="px-6 py-4 text-sm text-center font-medium text-red-600">{r.absent}</td>
                    <td className="px-6 py-4 text-sm text-center text-slate-700">{r.half}</td>
                    <td className="px-6 py-4 text-sm text-center text-slate-700">{r.leave}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-indigo-600">{r.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // LEAVE REPORT LOGIC
  // ----------------------------------------------------
  const renderLeaveReport = () => {
    let requests = leaveService.getAllLeaveRequests();
    
    if (deptFilter !== 'All') requests = requests.filter(r => r.department === deptFilter);
    if (searchQuery) requests = requests.filter(r => (r.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (r.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase()));

    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;

    const paidLeave = requests.filter(r => r.type === 'Paid Leave').length;
    const sickLeave = requests.filter(r => r.type === 'Sick Leave').length;
    const unpaidLeave = requests.filter(r => r.type === 'Unpaid Leave').length;

    const exportCsv = () => {
      exportToCsv('Leave_Report.csv', requests.map(r => ({
        'Employee': r.employeeName,
        'Employee ID': r.employeeId,
        'Department': r.department,
        'Leave Type': r.type,
        'Days': r.days,
        'Start Date': r.startDate,
        'End Date': r.endDate,
        'Status': r.status
      })));
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center print-hidden">
          <h2 className="text-lg font-bold text-slate-900">Leave Report - All Time</h2>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-xs py-1.5 px-3" onClick={exportCsv}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
            <Button variant="primary" className="text-xs py-1.5 px-3" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Requests</p>
            <p className="text-2xl font-black text-slate-900">{total}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-2xl font-black text-amber-700">{pending}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Approved</p>
            <p className="text-2xl font-black text-emerald-700">{approved}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Rejected</p>
            <p className="text-2xl font-black text-red-700">{rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Leave Type Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <p className="text-xs text-slate-500">Paid Leave</p>
              <p className="text-xl font-bold text-slate-900">{paidLeave}</p>
            </div>
            <div className="border-l-4 border-rose-500 pl-4 py-1">
              <p className="text-xs text-slate-500">Sick Leave</p>
              <p className="text-xl font-bold text-slate-900">{sickLeave}</p>
            </div>
            <div className="border-l-4 border-slate-500 pl-4 py-1">
              <p className="text-xs text-slate-500">Unpaid Leave</p>
              <p className="text-xl font-bold text-slate-900">{unpaidLeave}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Days</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{r.employeeName}</p>
                      <p className="text-xs text-slate-500">{r.employeeId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.department}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{r.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.days}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // PAYROLL REPORT LOGIC
  // ----------------------------------------------------
  const renderPayrollReport = () => {
    const period = `${monthFilter} ${yearFilter}`;
    let records = payrollService.getAllPayrollRecords(period);
    
    if (deptFilter !== 'All') records = records.filter(r => r.department === deptFilter);
    if (searchQuery) records = records.filter(r => r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalEmployees = records.length;
    const totalGross = records.reduce((s, r) => s + r.grossSalary, 0);
    const totalDeductions = records.reduce((s, r) => s + r.totalDeductions, 0);
    const totalNet = records.reduce((s, r) => s + r.netSalary, 0);

    const exportCsv = () => {
      exportToCsv(`Payroll_Report_${period.replace(' ', '_')}.csv`, records.map(r => ({
        'Employee': r.employeeName,
        'Employee ID': r.employeeId,
        'Department': r.department,
        'Basic Salary': r.breakdown.basic,
        'Allowances': r.breakdown.allowances + r.breakdown.hra + r.breakdown.bonus,
        'Gross Salary': r.grossSalary,
        'Deductions': r.totalDeductions,
        'Net Salary': r.netSalary,
        'Status': r.status
      })));
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center print-hidden">
          <h2 className="text-lg font-bold text-slate-900">Payroll Report - {period}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-xs py-1.5 px-3" onClick={exportCsv}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
            <Button variant="primary" className="text-xs py-1.5 px-3" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Employees</p>
            <p className="text-2xl font-black text-slate-900">{totalEmployees}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Gross Payroll</p>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(totalGross)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Total Deductions</p>
            <p className="text-2xl font-black text-red-700">{formatCurrency(totalDeductions)}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Net Payroll</p>
            <p className="text-2xl font-black text-emerald-700">{formatCurrency(totalNet)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4 text-right">Basic</th>
                  <th className="px-6 py-4 text-right">Allowances</th>
                  <th className="px-6 py-4 text-right">Gross</th>
                  <th className="px-6 py-4 text-right text-red-600">Deductions</th>
                  <th className="px-6 py-4 text-right font-bold text-emerald-600">Net Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{r.employeeName}</p>
                      <p className="text-xs text-slate-500">{r.employeeId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.department}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-700">{formatCurrency(r.breakdown.basic)}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-700">{formatCurrency(r.breakdown.allowances + r.breakdown.hra + r.breakdown.bonus)}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-slate-900">{formatCurrency(r.grossSalary)}</td>
                    <td className="px-6 py-4 text-sm text-right text-red-600">{formatCurrency(r.totalDeductions)}</td>
                    <td className="px-6 py-4 text-sm text-right font-black text-emerald-600">{formatCurrency(r.netSalary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // EMPLOYEE REPORT LOGIC
  // ----------------------------------------------------
  const renderEmployeeReport = () => {
    let records = employees;
    
    if (deptFilter !== 'All') records = records.filter(r => r.department === deptFilter);
    if (searchQuery) records = records.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const total = records.length;
    const active = records.filter(r => r.employmentStatus === 'Active').length;
    const inactive = records.filter(r => r.employmentStatus === 'Inactive').length;
    const onLeave = records.filter(r => r.employmentStatus === 'On Leave').length;

    const exportCsv = () => {
      exportToCsv('Employee_Report.csv', records.map(r => ({
        'Name': r.name,
        'Employee ID': r.id,
        'Department': r.department,
        'Designation': r.designation,
        'Joining Date': '01 Jan 2025',
        'Status': r.employmentStatus
      })));
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center print-hidden">
          <h2 className="text-lg font-bold text-slate-900">Employee Report</h2>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-xs py-1.5 px-3" onClick={exportCsv}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
            <Button variant="primary" className="text-xs py-1.5 px-3" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Employees</p>
            <p className="text-2xl font-black text-slate-900">{total}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Active</p>
            <p className="text-2xl font-black text-emerald-700">{active}</p>
          </div>
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Inactive</p>
            <p className="text-2xl font-black text-slate-700">{inactive}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">On Leave</p>
            <p className="text-2xl font-black text-amber-700">{onLeave}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Joining Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.designation}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">01 Jan 2025</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${r.employmentStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : r.employmentStatus === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {r.employmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative print-container">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 print-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 mt-1">Generate and review workforce reports.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg w-max print-hidden">
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'attendance' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Clock className="w-4 h-4 mr-2" /> Attendance
        </button>
        <button 
          onClick={() => setActiveTab('leave')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'leave' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Calendar className="w-4 h-4 mr-2" /> Leave
        </button>
        <button 
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'payroll' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Wallet className="w-4 h-4 mr-2" /> Payroll
        </button>
        <button 
          onClick={() => setActiveTab('employees')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'employees' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Users className="w-4 h-4 mr-2" /> Employees
        </button>
      </div>

      {/* Global Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center print-hidden">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search report..." 
            className="pl-9 pr-8 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white min-w-[140px]"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
          
          {(activeTab === 'attendance' || activeTab === 'payroll') && (
            <>
              <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              >
                {['August', 'July', 'June', 'May', 'April', 'March'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select 
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="print-content">
        {activeTab === 'attendance' && renderAttendanceReport()}
        {activeTab === 'leave' && renderLeaveReport()}
        {activeTab === 'payroll' && renderPayrollReport()}
        {activeTab === 'employees' && renderEmployeeReport()}
      </div>

    </div>
  );
};
