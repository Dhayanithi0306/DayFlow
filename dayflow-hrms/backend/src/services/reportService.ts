import { prisma } from '../config/db.js';
import { ReportQueryParams, validateReportQuery } from '../validators/reportValidators.js';

export class ReportService {
  /**
   * Admin Employee Report (Paginated, Filtered, Sorted)
   */
  static async getEmployeeReport(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const validation = validateReportQuery('employees', params);
    if (!validation.isValid) throw { statusCode: 400, message: validation.message };

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const whereClause: any = { companyId };
    if (params.departmentId) whereClause.departmentId = params.departmentId;
    if (params.status) whereClause.employmentStatus = params.status;

    if (params.startDate || params.endDate) {
      whereClause.joiningDate = {};
      if (params.startDate) whereClause.joiningDate.gte = new Date(params.startDate);
      if (params.endDate) whereClause.joiningDate.lte = new Date(params.endDate);
    }

    const orderBy: any = {};
    const sortBy = params.sortBy || 'joiningDate';
    const sortOrder = params.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause,
        include: {
          department: { select: { id: true, name: true } },
          manager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
          user: { select: { email: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.employee.count({ where: whereClause }),
    ]);

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_VIEWED',
        entityType: 'REPORT',
        description: 'Admin viewed Employee Report.',
      },
    });

    const totalPages = Math.ceil(total / limit) || 1;
    return { items, page, limit, total, totalPages };
  }

  /**
   * Admin Attendance Report (Paginated, Filtered, Sorted)
   */
  static async getAttendanceReport(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const validation = validateReportQuery('attendance', params);
    if (!validation.isValid) throw { statusCode: 400, message: validation.message };

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const whereClause: any = { employee: { companyId } };
    if (params.departmentId) whereClause.employee.departmentId = params.departmentId;
    if (params.employeeId) whereClause.employeeId = params.employeeId;
    if (params.status) whereClause.status = params.status;

    if (params.startDate || params.endDate) {
      whereClause.date = {};
      if (params.startDate) whereClause.date.gte = new Date(params.startDate);
      if (params.endDate) whereClause.date.lte = new Date(params.endDate);
    }

    const orderBy: any = {};
    const sortBy = params.sortBy || 'date';
    const sortOrder = params.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

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
              department: { select: { id: true, name: true } },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.attendance.count({ where: whereClause }),
    ]);

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_VIEWED',
        entityType: 'REPORT',
        description: 'Admin viewed Attendance Report.',
      },
    });

    const totalPages = Math.ceil(total / limit) || 1;
    return { items, page, limit, total, totalPages };
  }

  /**
   * Admin Leave Report (Paginated, Filtered, Sorted)
   */
  static async getLeaveReport(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const validation = validateReportQuery('leave', params);
    if (!validation.isValid) throw { statusCode: 400, message: validation.message };

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const whereClause: any = { employee: { companyId } };
    if (params.departmentId) whereClause.employee.departmentId = params.departmentId;
    if (params.employeeId) whereClause.employeeId = params.employeeId;
    if (params.status) whereClause.status = params.status;
    if (params.leaveType) whereClause.leaveType = params.leaveType;

    if (params.startDate || params.endDate) {
      whereClause.startDate = {};
      if (params.startDate) whereClause.startDate.gte = new Date(params.startDate);
      if (params.endDate) whereClause.startDate.lte = new Date(params.endDate);
    }

    const orderBy: any = {};
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

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
              department: { select: { id: true, name: true } },
            },
          },
          reviewer: { select: { id: true, email: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.leaveRequest.count({ where: whereClause }),
    ]);

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_VIEWED',
        entityType: 'REPORT',
        description: 'Admin viewed Leave Report.',
      },
    });

    const totalPages = Math.ceil(total / limit) || 1;
    return { items, page, limit, total, totalPages };
  }

  /**
   * Admin Payroll Report (Paginated, Filtered, Sorted)
   */
  static async getPayrollReport(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const validation = validateReportQuery('payroll', params);
    if (!validation.isValid) throw { statusCode: 400, message: validation.message };

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    const whereClause: any = { employee: { companyId } };
    if (params.departmentId) whereClause.employee.departmentId = params.departmentId;
    if (params.employeeId) whereClause.employeeId = params.employeeId;

    if (params.startDate || params.endDate) {
      whereClause.payPeriodStart = {};
      if (params.startDate) whereClause.payPeriodStart.gte = new Date(params.startDate);
      if (params.endDate) whereClause.payPeriodStart.lte = new Date(params.endDate);
    }

    const orderBy: any = {};
    const sortBy = params.sortBy || 'payPeriodEnd';
    const sortOrder = params.sortOrder || 'desc';
    orderBy[sortBy] = sortOrder;

    const [items, total] = await Promise.all([
      prisma.payrollRecord.findMany({
        where: whereClause,
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
          payslip: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.payrollRecord.count({ where: whereClause }),
    ]);

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_VIEWED',
        entityType: 'REPORT',
        description: 'Admin viewed Payroll Report.',
      },
    });

    const totalPages = Math.ceil(total / limit) || 1;
    return { items, page, limit, total, totalPages };
  }
}
