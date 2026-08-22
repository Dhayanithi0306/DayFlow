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

export interface DepartmentAttendanceChartProps {
  data: {
    departmentName: string;
    present: number;
    absent: number;
    leave: number;
  }[];
}

export const DepartmentAttendanceChart: React.FC<DepartmentAttendanceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs text-slate-400 italic">No department attendance data available.</div>;
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="departmentName" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="present" name="Present" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
          <Bar dataKey="leave" name="On Leave" fill="#6366f1" stackId="a" radius={[0, 0, 0, 0]} />
          <Bar dataKey="absent" name="Absent" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
