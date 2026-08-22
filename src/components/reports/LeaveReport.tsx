import React from 'react';
import type { LeaveReport as LeaveReportType } from '../../types/reports';

interface LeaveReportProps {
  report: LeaveReportType | null;
  isLoading: boolean;
}

export const LeaveReport: React.FC<LeaveReportProps> = ({ report, isLoading }) => {
  if (isLoading) return <div className="p-4 bg-white rounded shadow-sm border border-gray-100 text-gray-500">Loading Leave Report...</div>;
  if (!report) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Requests</div>
          <div className="text-xl font-bold text-gray-900">{report.totalRequests}</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="text-sm text-yellow-600">Pending</div>
          <div className="text-xl font-bold text-yellow-700">{report.pending}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600">Approved</div>
          <div className="text-xl font-bold text-green-700">{report.approved}</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="text-sm text-red-600">Rejected</div>
          <div className="text-xl font-bold text-red-700">{report.rejected}</div>
        </div>
      </div>
    </div>
  );
};
