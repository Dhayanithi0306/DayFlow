import React, { useEffect, useState } from 'react';
import { getAttendanceReport, getLeaveReport, getEmployeeReport } from '../../services/reportService';
import type { AttendanceReport, LeaveReport, EmployeeReport } from '../../types/reports';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

export const AnalyticsDashboard: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceReport | null>(null);
  const [leave, setLeave] = useState<LeaveReport | null>(null);
  const [employee, setEmployee] = useState<EmployeeReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [attData, leaveData, empData] = await Promise.all([
          getAttendanceReport(10, 2023),
          getLeaveReport(10, 2023),
          getEmployeeReport()
        ]);
        setAttendance(attData);
        setLeave(leaveData);
        setEmployee(empData);
      } catch (error) {
        console.error("Error fetching analytics data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Loading Analytics...</div>;
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Formatting Data for Charts
  const departmentData = employee ? Object.keys(employee.byDepartment).map(key => ({
    name: key,
    value: employee.byDepartment[key]
  })) : [];

  const leaveDataChart = leave ? Object.keys(leave.leaveTypeDistribution).map(key => ({
    name: key,
    value: leave.leaveTypeDistribution[key]
  })) : [];

  // Mock Payroll Trend Data
  const payrollTrendData = [
    { name: 'May', payroll: 250000 },
    { name: 'Jun', payroll: 260000 },
    { name: 'Jul', payroll: 275000 },
    { name: 'Aug', payroll: 270000 },
    { name: 'Sep', payroll: 290000 },
    { name: 'Oct', payroll: 310000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Payroll Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Payroll Trend (6 Months)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Line type="monotone" dataKey="payroll" stroke="#4F46E5" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Employees by Department</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Leave Distribution (Oct 2023)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveDataChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveDataChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
