import { prisma } from '../config/db.js';
import { AttendanceService } from './attendanceService.js';
import { LeaveService } from './leaveService.js';
import { PayrollService } from './payrollService.js';

export class DashboardService {
  /**
   * Aggregates real PostgreSQL data for Employee Dashboard
   */
  static async getEmployeeDashboard(userId: string) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: {
        department: { select: { name: true } },
        user: { select: { email: true } },
      },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayAttendance, monthlySummary, balances, upcomingLeave, salaryInfo, recentPayroll, unreadCount] =
      await Promise.all([
        AttendanceService.getTodayAttendance(userId),
        AttendanceService.getEmployeeSummary(userId, 'month'),
        LeaveService.getEmployeeLeaveBalances(userId),
        prisma.leaveRequest.findMany({
          where: {
            employeeId: employee.id,
            status: 'APPROVED',
            endDate: { gte: today },
          },
          orderBy: { startDate: 'asc' },
          take: 3,
        }),
        PayrollService.getEmployeeSalary(userId),
        prisma.payrollRecord.findFirst({
          where: { employeeId: employee.id },
          orderBy: { payPeriodEnd: 'desc' },
        }),
        prisma.notification.count({
          where: { userId, isRead: false },
        }),
      ]);

    return {
      employee: {
        id: employee.id,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        designation: employee.designation,
        departmentName: employee.department?.name || 'N/A',
        profilePictureUrl: employee.profilePictureUrl,
        email: employee.user.email,
      },
      todayAttendance,
      attendanceSummary: monthlySummary,
      leaveBalances: balances,
      upcomingLeave,
      salaryInfo: salaryInfo.configured ? salaryInfo.computed : null,
      recentPayroll,
      unreadCount,
    };
  }

  /**
   * Aggregates real PostgreSQL data for Admin Dashboard
   */
  static async getAdminDashboard(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalActiveEmployees, todayAttendances, pendingLeavesCount, payrollSummary, recentAuditLogs] =
      await Promise.all([
        prisma.employee.count({
          where: { companyId, employmentStatus: 'ACTIVE' },
        }),
        prisma.attendance.findMany({
          where: {
            employee: { companyId },
            date: today,
          },
        }),
        prisma.leaveRequest.count({
          where: {
            employee: { companyId },
            status: 'PENDING',
          },
        }),
        PayrollService.getAdminPayrollSummary(companyId),
        prisma.auditLog.findMany({
          where: { companyId },
          include: {
            user: {
              select: {
                email: true,
                employee: { select: { firstName: true, lastName: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
        }),
      ]);

    const presentCount = todayAttendances.filter((a) => a.status === 'PRESENT').length;
    const halfDayCount = todayAttendances.filter((a) => a.status === 'HALF_DAY').length;
    const leaveCount = todayAttendances.filter((a) => a.status === 'LEAVE').length;
    const absentCount = Math.max(0, totalActiveEmployees - (presentCount + halfDayCount + leaveCount));

    return {
      totalActiveEmployees,
      todayAttendance: {
        presentCount,
        absentCount,
        halfDayCount,
        leaveCount,
      },
      pendingLeavesCount,
      payrollSummary,
      recentAuditLogs,
    };
  }
}
