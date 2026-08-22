import { LeaveType, LeaveStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { CreateLeaveRequestInput, ReviewLeaveRequestInput, validateCreateLeaveRequest } from '../validators/leaveValidators.js';

export interface LeaveQueryParams {
  page?: number;
  limit?: number;
  status?: LeaveStatus;
  leaveType?: LeaveType;
  departmentId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export class LeaveService {
  /**
   * Helper: Calculate inclusive calendar days duration
   */
  public static calculateDuration(startDate: Date, endDate: Date): number {
    const s = new Date(startDate);
    const e = new Date(endDate);
    s.setHours(0, 0, 0, 0);
    e.setHours(0, 0, 0, 0);

    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }

  /**
   * Helper: Ensure LeaveBalance records exist for employee
   */
  public static async getOrCreateLeaveBalances(employeeId: string) {
    const existing = await prisma.leaveBalance.findMany({
      where: { employeeId },
    });

    const types: { type: LeaveType; defaultAllocated: number }[] = [
      { type: LeaveType.PAID, defaultAllocated: 12 },
      { type: LeaveType.SICK, defaultAllocated: 10 },
      { type: LeaveType.UNPAID, defaultAllocated: 30 },
    ];

    for (const t of types) {
      const found = existing.find((b) => b.leaveType === t.type);
      if (!found) {
        await prisma.leaveBalance.create({
          data: {
            employeeId,
            leaveType: t.type,
            allocatedDays: t.defaultAllocated,
            usedDays: 0,
          },
        });
      }
    }

    return prisma.leaveBalance.findMany({
      where: { employeeId },
    });
  }

  /**
   * Employee Create Leave Request
   */
  static async createLeaveRequest(userId: string, input: CreateLeaveRequestInput) {
    const validation = validateCreateLeaveRequest(input);
    if (!validation.isValid) {
      throw { statusCode: 400, message: validation.message };
    }

    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const duration = this.calculateDuration(startDate, endDate);

    // Overlap Check: Ensure no active (PENDING/APPROVED) request covers overlapping dates
    const overlapping = await prisma.leaveRequest.findFirst({
      where: {
        employeeId: employee.id,
        status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
        AND: [
          { startDate: { lte: endDate } },
          { endDate: { gte: startDate } },
        ],
      },
    });

    if (overlapping) {
      throw { statusCode: 400, message: 'You already have an active leave request covering part of these dates.' };
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        leaveType: input.leaveType,
        startDate,
        endDate,
        duration,
        remarks: input.remarks || null,
        attachmentUrl: input.attachmentUrl || null,
        status: LeaveStatus.PENDING,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId: employee.companyId,
        userId,
        action: 'LEAVE_CREATED',
        entityType: 'LEAVE',
        entityId: leaveRequest.id,
        description: `Employee ${employee.employeeId} submitted ${input.leaveType} leave request for ${duration} days.`,
      },
    });

    // Notification Trigger: Notify Admins of new leave submission
    const admins = await prisma.user.findMany({
      where: { companyId: employee.companyId, role: 'ADMIN' },
      select: { id: true },
    });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId: admin.id,
          type: 'LEAVE_SUBMITTED',
          title: 'New Leave Request',
          message: `New ${input.leaveType} leave application submitted by ${employee.firstName} ${employee.lastName} (${duration} days).`,
          linkUrl: '/admin/time-off',
          isRead: false,
        })),
      });
    }

    return leaveRequest;
  }

  /**
   * Get Employee Leave History (Paginated)
   */
  static async getEmployeeLeaveHistory(userId: string, params: LeaveQueryParams) {
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

    if (params.status) whereClause.status = params.status;
    if (params.leaveType) whereClause.leaveType = params.leaveType;

    const [items, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.leaveRequest.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages };
  }

  /**
   * Get Employee Leave Balances
   */
  static async getEmployeeLeaveBalances(userId: string) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const balances = await this.getOrCreateLeaveBalances(employee.id);

    return balances.map((b) => ({
      leaveType: b.leaveType,
      allocatedDays: b.allocatedDays,
      usedDays: b.usedDays,
      remainingDays: Math.max(0, b.allocatedDays - b.usedDays),
    }));
  }

  /**
   * Admin List Leave Requests (Search, Filter, Pagination)
   */
  static async listAdminLeaveRequests(companyId: string, params: LeaveQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = {
      employee: { companyId },
    };

    if (params.status) whereClause.status = params.status;
    if (params.leaveType) whereClause.leaveType = params.leaveType;
    if (params.employeeId) whereClause.employeeId = params.employeeId;

    if (params.departmentId) {
      whereClause.employee = { ...whereClause.employee, departmentId: params.departmentId };
    }

    const [items, total] = await Promise.all([
      prisma.leaveRequest.findMany({
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.leaveRequest.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages };
  }

  /**
   * Admin Leave Summary Metrics
   */
  static async getAdminLeaveSummary(companyId: string) {
    const whereCompany = { employee: { companyId } };

    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.leaveRequest.count({ where: { ...whereCompany, status: LeaveStatus.PENDING } }),
      prisma.leaveRequest.count({ where: { ...whereCompany, status: LeaveStatus.APPROVED } }),
      prisma.leaveRequest.count({ where: { ...whereCompany, status: LeaveStatus.REJECTED } }),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOnLeaveCount = await prisma.leaveRequest.count({
      where: {
        ...whereCompany,
        status: LeaveStatus.APPROVED,
        startDate: { lte: today },
        endDate: { gte: today },
      },
    });

    return {
      pendingCount,
      approvedCount,
      rejectedCount,
      todayOnLeaveCount,
    };
  }

  /**
   * Admin Approve Leave Request (Prisma Transaction + Balance Update + Audit Log)
   */
  static async approveLeaveRequest(adminUserId: string, companyId: string, leaveId: string, reviewerComment?: string) {
    const leave = await prisma.leaveRequest.findFirst({
      where: {
        id: leaveId,
        employee: { companyId },
      },
      include: { employee: true },
    });

    if (!leave) {
      throw { statusCode: 404, message: 'Leave request not found.' };
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw { statusCode: 400, message: `Leave request is already ${leave.status}.` };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update LeaveRequest status to APPROVED
      const updatedLeave = await tx.leaveRequest.update({
        where: { id: leaveId },
        data: {
          status: LeaveStatus.APPROVED,
          reviewedById: adminUserId,
          reviewedAt: new Date(),
          reviewerComment: reviewerComment || 'Approved by HR Administrator',
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeId: true,
              department: { select: { name: true } },
            },
          },
        },
      });

      // 2. Update LeaveBalance usedDays
      const balance = await tx.leaveBalance.findUnique({
        where: {
          employeeId_leaveType: {
            employeeId: leave.employeeId,
            leaveType: leave.leaveType,
          },
        },
      });

      if (balance) {
        await tx.leaveBalance.update({
          where: { id: balance.id },
          data: { usedDays: balance.usedDays + leave.duration },
        });
      } else {
        await tx.leaveBalance.create({
          data: {
            employeeId: leave.employeeId,
            leaveType: leave.leaveType,
            allocatedDays: leave.leaveType === 'PAID' ? 12 : leave.leaveType === 'SICK' ? 10 : 30,
            usedDays: leave.duration,
          },
        });
      }

      // 3. Create AuditLog
      await tx.auditLog.create({
        data: {
          companyId,
          userId: adminUserId,
          action: 'LEAVE_APPROVED',
          entityType: 'LEAVE',
          entityId: leaveId,
          description: `Admin approved ${leave.leaveType} leave for ${leave.employee.employeeId} (${leave.duration} days).`,
        },
      });

      // 4. Create Notification for Employee
      await tx.notification.create({
        data: {
          userId: leave.employee.userId,
          type: 'LEAVE_APPROVED',
          title: 'Leave Request Approved',
          message: `Your ${leave.leaveType} leave request for ${leave.duration} day(s) has been approved.`,
          linkUrl: '/employee/time-off',
        },
      });

      return updatedLeave;
    });

    return result;
  }

  /**
   * Admin Reject Leave Request
   */
  static async rejectLeaveRequest(adminUserId: string, companyId: string, leaveId: string, reviewerComment?: string) {
    const leave = await prisma.leaveRequest.findFirst({
      where: {
        id: leaveId,
        employee: { companyId },
      },
      include: { employee: true },
    });

    if (!leave) {
      throw { statusCode: 404, message: 'Leave request not found.' };
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw { statusCode: 400, message: `Leave request is already ${leave.status}.` };
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedLeave = await tx.leaveRequest.update({
        where: { id: leaveId },
        data: {
          status: LeaveStatus.REJECTED,
          reviewedById: adminUserId,
          reviewedAt: new Date(),
          reviewerComment: reviewerComment || 'Request rejected by HR Administrator',
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeId: true,
            },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          companyId,
          userId: adminUserId,
          action: 'LEAVE_REJECTED',
          entityType: 'LEAVE',
          entityId: leaveId,
          description: `Admin rejected ${leave.leaveType} leave for ${leave.employee.employeeId}.`,
        },
      });

      await tx.notification.create({
        data: {
          userId: leave.employee.userId,
          type: 'LEAVE_REJECTED',
          title: 'Leave Request Rejected',
          message: `Your ${leave.leaveType} leave request has been rejected by HR.`,
          linkUrl: '/employee/time-off',
        },
      });

      return updatedLeave;
    });

    return result;
  }
}
