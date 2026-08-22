import React from 'react';
import type { AttendanceReport as AttendanceReportType } from '../../types/reports';

interface AttendanceReportProps {
  report: AttendanceReportType | null;
  isLoading: boolean;
}

export const AttendanceReport: React.FC<AttendanceReportProps> = ({ report, isLoading }) => {
  if (isLoading) return <div className="p-4 bg-white rounded shadow-sm border border-gray-100 text-gray-500">Loading Attendance Report...</div>;
  if (!report) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Employees</div>
          <div className="text-xl font-bold text-gray-900">{report.totalEmployees}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600">Present</div>
          <div className="text-xl font-bold text-green-700">{report.present}</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="text-sm text-red-600">Absent</div>
          <div className="text-xl font-bold text-red-700">{report.absent}</div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="text-sm text-indigo-600">Attendance %</div>
          <div className="text-xl font-bold text-indigo-700">{report.attendancePercentage.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};
