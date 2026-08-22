import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export interface PayrollSummaryChartProps {
  data: {
    departmentName: string;
    grossPayroll: string;
    netPayroll: string;
  }[];
}

export const PayrollSummaryChart: React.FC<PayrollSummaryChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs text-slate-400 italic">No department payroll data available.</div>;
  }

  const numericData = data.map((d) => ({
    departmentName: d.departmentName,
    grossPayroll: Number(d.grossPayroll),
    netPayroll: Number(d.netPayroll),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={numericData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="departmentName" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="grossPayroll" name="Gross Outflow" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="netPayroll" name="Net Outflow" fill="#059669" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
