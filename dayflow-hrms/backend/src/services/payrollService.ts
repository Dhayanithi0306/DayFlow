import { Prisma } from '@prisma/client';
import { prisma } from '../config/db.js';
import { UpdateSalaryStructureInput, GeneratePayrollInput, validateUpdateSalaryStructure, validateGeneratePayroll } from '../validators/payrollValidators.js';

export interface PayrollQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  employeeId?: string;
}

export class PayrollService {
  /**
   * Centralized backend calculation for gross salary, total deductions, and net salary
   */
  public static calculateSalaryTotals(structure: {
    basicSalary: number | Prisma.Decimal;
    hra?: number | Prisma.Decimal;
    standardAllowance?: number | Prisma.Decimal;
    performanceBonus?: number | Prisma.Decimal;
    leaveTravelAllowance?: number | Prisma.Decimal;
    fixedAllowance?: number | Prisma.Decimal;
    providentFund?: number | Prisma.Decimal;
    professionalTax?: number | Prisma.Decimal;
  }) {
    const basic = Number(structure.basicSalary || 0);
    const hra = Number(structure.hra || 0);
    const standard = Number(structure.standardAllowance || 0);
    const bonus = Number(structure.performanceBonus || 0);
    const lta = Number(structure.leaveTravelAllowance || 0);
    const fixed = Number(structure.fixedAllowance || 0);

    const pf = Number(structure.providentFund || 0);
    const profTax = Number(structure.professionalTax || 0);

    const grossSalary = basic + hra + standard + bonus + lta + fixed;
    const totalDeductions = pf + profTax;
    const netSalary = Math.max(0, grossSalary - totalDeductions);

    return {
      basicSalary: basic.toFixed(2),
      hra: hra.toFixed(2),
      standardAllowance: standard.toFixed(2),
      performanceBonus: bonus.toFixed(2),
      leaveTravelAllowance: lta.toFixed(2),
      fixedAllowance: fixed.toFixed(2),
      providentFund: pf.toFixed(2),
      professionalTax: profTax.toFixed(2),
      grossSalary: grossSalary.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      netSalary: netSalary.toFixed(2),
    };
  }

  /**
   * Helper: Get active SalaryStructure by latest effectiveFrom <= current date
   */
  public static async getActiveSalaryStructure(employeeId: string) {
    const now = new Date();

    const structure = await prisma.salaryStructure.findFirst({
      where: {
        employeeId,
        effectiveFrom: { lte: now },
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!structure) {
      // Fallback to latest effective structure if all are in future
      return prisma.salaryStructure.findFirst({
        where: { employeeId },
        orderBy: { effectiveFrom: 'desc' },
      });
    }

    return structure;
  }

  /**
   * Get Employee's Active Salary Structure & Calculated Totals
   */
  static async getEmployeeSalary(userId: string) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const structure = await this.getActiveSalaryStructure(employee.id);

    if (!structure) {
      return {
        configured: false,
        message: 'No salary structure configured for this employee.',
      };
    }

    const computed = this.calculateSalaryTotals(structure);

    return {
      configured: true,
      structure,
      computed,
    };
  }

  /**
   * Get Employee's Payroll History (Paginated)
   */
  static async getEmployeePayrollHistory(userId: string, params: PayrollQueryParams) {
    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.payrollRecord.findMany({
        where: { employeeId: employee.id },
        include: { payslip: true },
        orderBy: { payPeriodEnd: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payrollRecord.count({ where: { employeeId: employee.id } }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages };
  }

  /**
   * Admin List Payroll (Search by Employee Name/ID, Department filter, Pagination)
   */
  static async listAdminPayroll(companyId: string, params: PayrollQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = {
      employee: { companyId },
    };

    if (params.departmentId) {
      whereClause.employee.departmentId = params.departmentId;
    }

    if (params.search && params.search.trim()) {
      const search = params.search.trim();
      whereClause.employee.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }

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
              profilePictureUrl: true,
              department: { select: { id: true, name: true } },
            },
          },
          payslip: true,
        },
        orderBy: { payPeriodEnd: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payrollRecord.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return { items, page, limit, total, totalPages };
  }

  /**
   * Admin Company Payroll Summary Statistics
   */
  static async getAdminPayrollSummary(companyId: string) {
    const totalEmployees = await prisma.employee.count({
      where: { companyId, employmentStatus: 'ACTIVE' },
    });

    const activeEmployees = await prisma.employee.findMany({
      where: { companyId, employmentStatus: 'ACTIVE' },
      select: { id: true },
    });

    let totalGross = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    let employeesWithSalary = 0;

    for (const emp of activeEmployees) {
      const salary = await this.getActiveSalaryStructure(emp.id);
      if (salary) {
        employeesWithSalary++;
        const computed = this.calculateSalaryTotals(salary);
        totalGross += Number(computed.grossSalary);
        totalDeductions += Number(computed.totalDeductions);
        totalNet += Number(computed.netSalary);
      }
    }

    return {
      totalEmployees,
      employeesWithSalary,
      totalGrossPayroll: totalGross.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      totalNetPayroll: totalNet.toFixed(2),
    };
  }

  /**
   * Admin Get Employee Salary Structure
   */
  static async getAdminEmployeeSalary(companyId: string, employeeId: string) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee not found.' };
    }

    const structure = await this.getActiveSalaryStructure(employeeId);

    if (!structure) {
      return { configured: false, employee };
    }

    const computed = this.calculateSalaryTotals(structure);

    return {
      configured: true,
      employee,
      structure,
      computed,
    };
  }

  /**
   * Admin Update Employee Salary Structure (Creates new SalaryStructure version + AuditLog)
   */
  static async updateEmployeeSalary(adminUserId: string, companyId: string, employeeId: string, input: UpdateSalaryStructureInput) {
    const validation = validateUpdateSalaryStructure(input);
    if (!validation.isValid) {
      throw { statusCode: 400, message: validation.message };
    }

    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee not found.' };
    }

    const effectiveFrom = new Date(input.effectiveFrom);

    const newStructure = await prisma.$transaction(async (tx) => {
      // 1. Create new SalaryStructure record (versioning preserves historical entries)
      const created = await tx.salaryStructure.create({
        data: {
          employeeId,
          basicSalary: new Prisma.Decimal(input.basicSalary),
          hra: new Prisma.Decimal(input.hra || 0),
          standardAllowance: new Prisma.Decimal(input.standardAllowance || 0),
          performanceBonus: new Prisma.Decimal(input.performanceBonus || 0),
          leaveTravelAllowance: new Prisma.Decimal(input.leaveTravelAllowance || 0),
          fixedAllowance: new Prisma.Decimal(input.fixedAllowance || 0),
          providentFund: new Prisma.Decimal(input.providentFund || 0),
          professionalTax: new Prisma.Decimal(input.professionalTax || 0),
          currency: input.currency || 'INR',
          effectiveFrom,
        },
      });

      // 2. Log Audit Event
      await tx.auditLog.create({
        data: {
          companyId,
          userId: adminUserId,
          action: 'SALARY_UPDATED',
          entityType: 'SALARY',
          entityId: created.id,
          description: `Admin updated salary structure for employee ${employee.employeeId} effective ${effectiveFrom.toISOString().split('T')[0]}.`,
        },
      });

      // 3. Notification Trigger
      await tx.notification.create({
        data: {
          userId: employee.userId,
          type: 'SALARY_UPDATED',
          title: 'Salary Structure Updated',
          message: 'Your salary structure has been updated by HR. View details in your payroll portal.',
          linkUrl: '/employee/payroll',
        },
      });

      return created;
    });

    const computed = this.calculateSalaryTotals(newStructure);

    return {
      structure: newStructure,
      computed,
    };
  }

  /**
   * Admin Generate Monthly Payroll Records for Company Employees
   */
  static async generatePayrollRecords(adminUserId: string, companyId: string, input: GeneratePayrollInput) {
    const validation = validateGeneratePayroll(input);
    if (!validation.isValid) {
      throw { statusCode: 400, message: validation.message };
    }

    const start = new Date(input.payPeriodStart);
    const end = new Date(input.payPeriodEnd);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const activeEmployees = await prisma.employee.findMany({
      where: { companyId, employmentStatus: 'ACTIVE' },
    });

    if (activeEmployees.length === 0) {
      throw { statusCode: 400, message: 'No active employees found to generate payroll.' };
    }

    let generatedCount = 0;
    let skippedCount = 0;

    await prisma.$transaction(async (tx) => {
      for (const emp of activeEmployees) {
        // Check duplicate payroll record for same period
        const existing = await tx.payrollRecord.findFirst({
          where: {
            employeeId: emp.id,
            payPeriodStart: start,
            payPeriodEnd: end,
          },
        });

        if (existing) {
          skippedCount++;
          continue;
        }

        const salary = await this.getActiveSalaryStructure(emp.id);
        if (!salary) {
          skippedCount++;
          continue;
        }

        const computed = this.calculateSalaryTotals(salary);

        // Attendance & Leave Integration
        const [attendances, approvedLeaves] = await Promise.all([
          tx.attendance.findMany({
            where: {
              employeeId: emp.id,
              date: { gte: start, lte: end },
            },
          }),
          tx.leaveRequest.findMany({
            where: {
              employeeId: emp.id,
              status: 'APPROVED',
              startDate: { lte: end },
              endDate: { gte: start },
            },
          }),
        ]);

        const totalDiffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const workingDays = Math.max(1, totalDiffDays);
        const presentDays = attendances.filter((a) => a.status === 'PRESENT' || a.status === 'HALF_DAY').length;
        const leaveDays = approvedLeaves.reduce((acc, l) => acc + l.duration, 0);
        const absentDays = Math.max(0, workingDays - (presentDays + leaveDays));

        await tx.payrollRecord.create({
          data: {
            employeeId: emp.id,
            salaryStructureId: salary.id,
            payPeriodStart: start,
            payPeriodEnd: end,
            grossSalary: new Prisma.Decimal(computed.grossSalary),
            totalDeductions: new Prisma.Decimal(computed.totalDeductions),
            netSalary: new Prisma.Decimal(computed.netSalary),
            workingDays,
            presentDays,
            leaveDays,
            absentDays,
          },
        });

        // Notification Trigger
        await tx.notification.create({
          data: {
            userId: emp.userId,
            type: 'PAYROLL_GENERATED',
            title: 'Payroll Generated',
            message: `Your payroll statement for period ${input.payPeriodStart} to ${input.payPeriodEnd} has been generated.`,
            linkUrl: '/employee/payroll',
          },
        });

        generatedCount++;
      }

      if (generatedCount > 0) {
        await tx.auditLog.create({
          data: {
            companyId,
            userId: adminUserId,
            action: 'PAYROLL_GENERATED',
            entityType: 'PAYROLL',
            description: `Admin generated ${generatedCount} payroll records for pay period ${input.payPeriodStart} to ${input.payPeriodEnd}.`,
          },
        });
      }
    });

    return {
      generatedCount,
      skippedCount,
      message: `Payroll generation completed: ${generatedCount} records generated, ${skippedCount} skipped/duplicate.`,
    };
  }
}
