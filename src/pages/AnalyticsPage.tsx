import React from 'react';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';

export const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Visualize human resource data and payroll trends.</p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
};
