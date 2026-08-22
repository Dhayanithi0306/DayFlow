import { prisma } from '../config/db.js';
import { PayrollService } from './payrollService.js';

export class AnalyticsService {
  static async getAdminAnalytics(companyId: string) {
    // 1. Employee Statistics
    const [totalEmployees, activeEmployees, inactiveEmployees, onLeaveEmployees, departments] =
      await Promise.all([
        prisma.employee.count({ where: { companyId } }),
        prisma.employee.count({ where: { companyId, employmentStatus: 'ACTIVE' } }),
        prisma.employee.count({ where: { companyId, employmentStatus: 'INACTIVE' } }),
        prisma.employee.count({ where: { companyId, employmentStatus: 'ON_LEAVE' } }),
        prisma.department.findMany({ where: { companyId }, select: { id: true, name: true } }),
      ]);

    // 2. Attendance Trend (Past 7 days)
    const now = new Date();
    const past7Days: { dateStr: string; date: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      past7Days.push({ dateStr: d.toISOString().split('T')[0], date: d });
    }

    const attendanceTrend = await Promise.all(
      past7Days.map(async (day) => {
        const records = await prisma.attendance.findMany({
          where: {
            employee: { companyId },
            date: day.date,
          },
        });
        const present = records.filter((r) => r.status === 'PRESENT').length;
        const halfDay = records.filter((r) => r.status === 'HALF_DAY').length;
        const leave = records.filter((r) => r.status === 'LEAVE').length;
        const absent = Math.max(0, activeEmployees - (present + halfDay + leave));

        return {
          date: day.dateStr,
          present,
          absent,
          halfDay,
          leave,
        };
      })
    );

    // 3. Department Attendance Breakdown
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departmentAttendance = await Promise.all(
      departments.map(async (dept) => {
        const deptActiveCount = await prisma.employee.count({
          where: { companyId, departmentId: dept.id, employmentStatus: 'ACTIVE' },
        });

        const records = await prisma.attendance.findMany({
          where: {
            employee: { companyId, departmentId: dept.id },
            date: today,
          },
        });

        const present = records.filter((r) => r.status === 'PRESENT' || r.status === 'HALF_DAY').length;
        const leave = records.filter((r) => r.status === 'LEAVE').length;
        const absent = Math.max(0, deptActiveCount - (present + leave));

        return {
          departmentName: dept.name,
          present,
          absent,
          leave,
        };
      })
    );

    // 4. Leave Distribution & Statuses
    const [pendingLeave, approvedLeave, rejectedLeave, leaveTypeGroups] = await Promise.all([
      prisma.leaveRequest.count({ where: { employee: { companyId }, status: 'PENDING' } }),
      prisma.leaveRequest.count({ where: { employee: { companyId }, status: 'APPROVED' } }),
      prisma.leaveRequest.count({ where: { employee: { companyId }, status: 'REJECTED' } }),
      prisma.leaveRequest.groupBy({
        by: ['leaveType'],
        where: { employee: { companyId } },
        _count: { id: true },
      }),
    ]);

    const leaveTypeDistribution = leaveTypeGroups.map((g) => ({
      leaveType: g.leaveType,
      count: g._count.id,
    }));

    // 5. Payroll Summary Statistics
    const payrollSummary = await PayrollService.getAdminPayrollSummary(companyId);

    // 6. Department Payroll Distribution
    const activeEmployeesList = await prisma.employee.findMany({
      where: { companyId, employmentStatus: 'ACTIVE' },
      include: { department: { select: { name: true } } },
    });

    const deptPayrollMap: Record<string, { gross: number; net: number }> = {};
    for (const emp of activeEmployeesList) {
      const deptName = emp.department?.name || 'Unassigned';
      if (!deptPayrollMap[deptName]) {
        deptPayrollMap[deptName] = { gross: 0, net: 0 };
      }

      const salary = await PayrollService.getActiveSalaryStructure(emp.id);
      if (salary) {
        const computed = PayrollService.calculateSalaryTotals(salary);
        deptPayrollMap[deptName].gross += Number(computed.grossSalary);
        deptPayrollMap[deptName].net += Number(computed.netSalary);
      }
    }

    const departmentPayroll = Object.keys(deptPayrollMap).map((deptName) => ({
      departmentName: deptName,
      grossPayroll: deptPayrollMap[deptName].gross.toFixed(2),
      netPayroll: deptPayrollMap[deptName].net.toFixed(2),
    }));

    return {
      employeeStats: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        onLeaveEmployees,
      },
      attendanceTrend,
      departmentAttendance,
      leaveStats: {
        pendingLeave,
        approvedLeave,
        rejectedLeave,
        leaveTypeDistribution,
      },
      payrollStats: payrollSummary,
      departmentPayroll,
    };
  }
}
