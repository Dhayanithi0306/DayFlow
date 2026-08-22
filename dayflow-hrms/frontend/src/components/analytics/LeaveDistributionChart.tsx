import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface LeaveDistributionChartProps {
  data: { leaveType: string; count: number }[];
}

const COLORS = ['#6366f1', '#f59e0b', '#06b6d4'];

export const LeaveDistributionChart: React.FC<LeaveDistributionChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs text-slate-400 italic">No leave distribution data available.</div>;
  }

  const formattedData = data.map((d) => ({
    name: d.leaveType === 'PAID' ? 'Paid Leave' : d.leaveType === 'SICK' ? 'Sick Leave' : 'Unpaid Leave',
    value: d.count,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {formattedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
