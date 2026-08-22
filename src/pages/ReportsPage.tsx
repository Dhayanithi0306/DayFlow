import React, { useState, useEffect } from 'react';
import { getPayrollSummary } from '../services/payrollService';
import { getAttendanceReport, getLeaveReport } from '../services/reportService';
import { PayrollReport } from '../components/reports/PayrollReport';
import { AttendanceReport } from '../components/reports/AttendanceReport';
import { LeaveReport } from '../components/reports/LeaveReport';
import type { PayrollSummary } from '../types/payroll';
import type { AttendanceReport as AttendanceReportType, LeaveReport as LeaveReportType } from '../types/reports';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = [2022, 2023, 2024];

export const ReportsPage: React.FC = () => {
  const [month, setMonth] = useState('October');
  const [year, setYear] = useState(2023);

  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null);
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReportType | null>(null);
  const [leaveReport, setLeaveReport] = useState<LeaveReportType | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const monthIndex = MONTHS.indexOf(month) + 1; // 1-indexed for backend
        
        const [payroll, attendance, leave] = await Promise.all([
          getPayrollSummary(month, year),
          getAttendanceReport(monthIndex, year),
          getLeaveReport(monthIndex, year)
        ]);

        setPayrollSummary(payroll);
        setAttendanceReport(attendance);
        setLeaveReport(leave);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [month, year]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Comprehensive overview of HR metrics and payroll.</p>
        </div>

        <div className="flex gap-4 mt-4 sm:mt-0">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border bg-white"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm border bg-white"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <PayrollReport summary={payrollSummary} isLoading={isLoading} />
        <AttendanceReport report={attendanceReport} isLoading={isLoading} />
        <LeaveReport report={leaveReport} isLoading={isLoading} />
      </div>
    </div>
  );
};
