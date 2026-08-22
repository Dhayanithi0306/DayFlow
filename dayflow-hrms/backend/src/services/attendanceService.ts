import { PrismaClient, AttendanceStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { AdminUpdateAttendanceInput, validateAdminAttendanceUpdate } from '../validators/attendanceValidators.js';

const STANDARD_SHIFT_MINUTES = 480; // 8 hours standard shift

export interface AttendanceQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  employeeId?: string;
  departmentId?: string;
}

export class AttendanceService {
  /**
   * Helper: Get normalized business date for today (midnight UTC Date)
   */
  public static getTodayBusinessDate(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  /**
   * Helper: Calculate working minutes and extra minutes
   */
  public static calculateMinutes(checkIn: Date, checkOut: Date | null): { workingMinutes: number; extraMinutes: number } {
    if (!checkOut) {
      return { workingMinutes: 0, extraMinutes: 0 };
    }

    const diffMs = checkOut.getTime() - checkIn.getTime();
    const workingMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    const extraMinutes = workingMinutes > STANDARD_SHIFT_MINUTES ? workingMinutes - STANDARD_SHIFT_MINUTES : 0;

    return { workingMinutes, extraMinutes };
  }

  /**
   * Employee Check-In
   */
  static async checkIn(userId: string) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const todayDate = this.getTodayBusinessDate();

    // Check if record exists for today
    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayDate,
      },
    });

    if (existing && existing.checkIn) {
      throw { statusCode: 400, message: 'You are already checked in today.' };
    }

    const now = new Date();

    let record;
    if (existing) {
      record = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkIn: now,
          status: AttendanceStatus.PRESENT,
        },
      });
    } else {
      record = await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: todayDate,
          checkIn: now,
          status: AttendanceStatus.PRESENT,
        },
      });
    }

    return record;
  }

  /**
   * Employee Check-Out
   */
  static async checkOut(userId: string) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const todayDate = this.getTodayBusinessDate();

    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayDate,
      },
    });

    if (!existing || !existing.checkIn) {
      throw { statusCode: 400, message: 'You must check in before checking out.' };
    }

    if (existing.checkOut) {
      throw { statusCode: 400, message: 'You have already checked out today.' };
    }

    const now = new Date();
    const { workingMinutes, extraMinutes } = this.calculateMinutes(existing.checkIn, now);

    const updated = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: now,
        workingMinutes,
        extraMinutes,
      },
    });

    return updated;
  }

  /**
   * Get Today's Attendance Record for Authenticated Employee
   */
  static async getTodayAttendance(userId: string) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const todayDate = this.getTodayBusinessDate();

    const record = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayDate,
      },
    });

    return record;
  }

  /**
   * Get Attendance History for Authenticated Employee (Paginated + Filtered)
   */
  static async getEmployeeAttendance(userId: string, params: AttendanceQueryParams) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = { employeeId: employee.id };

    if (params.status) {
      whereClause.status = params.status;
    }

    if (params.startDate || params.endDate) {
      whereClause.date = {};
      if (params.startDate) whereClause.date.gte = new Date(params.startDate);
      if (params.endDate) whereClause.date.lte = new Date(params.endDate);
    }

    const [items, total] = await Promise.all([
      prisma.attendance.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.attendance.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages };
  }

  /**
   * Get Employee Attendance Summary (Weekly / Monthly)
   */
  static async getEmployeeSummary(userId: string, timeframe: 'week' | 'month' = 'month') {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const now = new Date();
    let startDate = new Date();

    if (timeframe === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setDate(now.getDate() - 30);
    }

    const records = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: { gte: startDate },
      },
    });

    let presentCount = 0;
    let absentCount = 0;
    let halfDayCount = 0;
    let leaveCount = 0;
    let totalWorkingMinutes = 0;
    let totalExtraMinutes = 0;

    for (const r of records) {
      if (r.status === AttendanceStatus.PRESENT) presentCount++;
      else if (r.status === AttendanceStatus.ABSENT) absentCount++;
      else if (r.status === AttendanceStatus.HALF_DAY) halfDayCount++;
      else if (r.status === AttendanceStatus.LEAVE) leaveCount++;

      totalWorkingMinutes += r.workingMinutes || 0;
      totalExtraMinutes += r.extraMinutes || 0;
    }

    return {
      presentCount,
      absentCount,
      halfDayCount,
      leaveCount,
      totalWorkingMinutes,
      totalExtraMinutes,
      recordsCount: records.length,
    };
  }

  /**
   * Admin List Attendance (Search, Filter, Pagination)
   */
  static async listAdminAttendance(companyId: string, params: AttendanceQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = {
      employee: { companyId },
    };

    if (params.employeeId) {
      whereClause.employeeId = params.employeeId;
    }

    if (params.departmentId) {
      whereClause.employee = { ...whereClause.employee, departmentId: params.departmentId };
    }

    if (params.status) {
      whereClause.status = params.status;
    }

    if (params.startDate || params.endDate) {
      whereClause.date = {};
      if (params.startDate) whereClause.date.gte = new Date(params.startDate);
      if (params.endDate) whereClause.date.lte = new Date(params.endDate);
    }

    const [items, total] = await Promise.all([
      prisma.attendance.findMany({
        where: whereClause,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeId: true,
              profilePictureUrl: true,
              department: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.attendance.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages };
  }

  /**
   * Admin Attendance Summary Metrics for Today
   */
  static async getAdminSummary(companyId: string) {
    const todayDate = this.getTodayBusinessDate();

    const [totalEmployees, records] = await Promise.all([
      prisma.employee.count({ where: { companyId, employmentStatus: 'ACTIVE' } }),
      prisma.attendance.findMany({
        where: {
          employee: { companyId },
          date: todayDate,
        },
      }),
    ]);

    let presentCount = 0;
    let halfDayCount = 0;
    let leaveCount = 0;
    let absentCount = 0;

    for (const r of records) {
      if (r.status === AttendanceStatus.PRESENT) presentCount++;
      else if (r.status === AttendanceStatus.HALF_DAY) halfDayCount++;
      else if (r.status === AttendanceStatus.LEAVE) leaveCount++;
      else if (r.status === AttendanceStatus.ABSENT) absentCount++;
    }

    // Unrecorded active employees are counted as absent for today's summary metrics
    const unrecordedCount = Math.max(0, totalEmployees - records.length);
    absentCount += unrecordedCount;

    return {
      presentCount,
      halfDayCount,
      leaveCount,
      absentCount,
      totalEmployees,
    };
  }

  /**
   * Admin Attendance Correction (Recalculates minutes & logs AuditLog)
   */
  static async updateAttendance(adminUserId: string, companyId: string, attendanceId: string, input: AdminUpdateAttendanceInput) {
    const validation = validateAdminAttendanceUpdate(input);
    if (!validation.isValid) {
      throw { statusCode: 400, message: validation.message };
    }

    const existing = await prisma.attendance.findFirst({
      where: {
        id: attendanceId,
        employee: { companyId },
      },
      include: { employee: true },
    });

    if (!existing) {
      throw { statusCode: 404, message: 'Attendance record not found.' };
    }

    const checkIn = input.checkIn ? new Date(input.checkIn) : existing.checkIn;
    const checkOut = input.checkOut ? new Date(input.checkOut) : existing.checkOut;
    const status = input.status || existing.status;
    const remarks = input.remarks !== undefined ? input.remarks : existing.remarks;

    // Recalculate working and extra minutes
    const { workingMinutes, extraMinutes } = checkIn ? this.calculateMinutes(checkIn, checkOut) : { workingMinutes: 0, extraMinutes: 0 };

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.attendance.update({
        where: { id: attendanceId },
        data: {
          checkIn,
          checkOut,
          workingMinutes,
          extraMinutes,
          status,
          remarks,
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeId: true,
              department: { select: { id: true, name: true } },
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: adminUserId,
          action: 'ATTENDANCE_UPDATED',
          entityType: 'ATTENDANCE',
          entityId: attendanceId,
          description: `Admin updated attendance for ${existing.employee.employeeId} on ${existing.date.toISOString().split('T')[0]}.`,
        },
      });

      await tx.notification.create({
        data: {
          userId: existing.employee.userId,
          type: 'ATTENDANCE_UPDATED',
          title: 'Attendance Record Updated',
          message: `Your attendance record for ${existing.date.toISOString().split('T')[0]} has been updated by HR.`,
          linkUrl: '/employee/attendance',
        },
      });

      return updated;
    });

    return result;
  }
}
