import { prisma } from '../config/db.js';

export class SearchService {
  static async globalSearch(userId: string, role: string, companyId: string, query: string) {
    if (!query || query.trim().length < 2) {
      return { employees: [], attendance: [], leave: [], payroll: [] };
    }

    const searchTerm = query.trim();

    if (role === 'ADMIN') {
      const [employees, attendance, leave, payroll] = await Promise.all([
        prisma.employee.findMany({
          where: {
            companyId,
            OR: [
              { firstName: { contains: searchTerm, mode: 'insensitive' } },
              { lastName: { contains: searchTerm, mode: 'insensitive' } },
              { employeeId: { contains: searchTerm, mode: 'insensitive' } },
              { designation: { contains: searchTerm, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            designation: true,
            profilePictureUrl: true,
          },
          take: 5,
        }),
        prisma.attendance.findMany({
          where: {
            employee: { companyId },
            OR: [
              { remarks: { contains: searchTerm, mode: 'insensitive' } },
              { employee: { firstName: { contains: searchTerm, mode: 'insensitive' } } },
              { employee: { lastName: { contains: searchTerm, mode: 'insensitive' } } },
            ],
          },
          include: {
            employee: { select: { firstName: true, lastName: true, employeeId: true } },
          },
          orderBy: { date: 'desc' },
          take: 5,
        }),
        prisma.leaveRequest.findMany({
          where: {
            employee: { companyId },
            OR: [
              { remarks: { contains: searchTerm, mode: 'insensitive' } },
              { employee: { firstName: { contains: searchTerm, mode: 'insensitive' } } },
              { employee: { lastName: { contains: searchTerm, mode: 'insensitive' } } },
            ],
          },
          include: {
            employee: { select: { firstName: true, lastName: true, employeeId: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.payrollRecord.findMany({
          where: {
            employee: {
              companyId,
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { employeeId: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
          },
          include: {
            employee: { select: { firstName: true, lastName: true, employeeId: true } },
          },
          orderBy: { payPeriodEnd: 'desc' },
          take: 5,
        }),
      ]);

      return { employees, attendance, leave, payroll };
    } else {
      // Employee: Search only own records
      const employee = await prisma.employee.findUnique({
        where: { userId },
      });

      if (!employee) return { employees: [], attendance: [], leave: [], payroll: [] };

      const [attendance, leave, payroll] = await Promise.all([
        prisma.attendance.findMany({
          where: {
            employeeId: employee.id,
            remarks: { contains: searchTerm, mode: 'insensitive' },
          },
          orderBy: { date: 'desc' },
          take: 5,
        }),
        prisma.leaveRequest.findMany({
          where: {
            employeeId: employee.id,
            remarks: { contains: searchTerm, mode: 'insensitive' },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.payrollRecord.findMany({
          where: { employeeId: employee.id },
          orderBy: { payPeriodEnd: 'desc' },
          take: 5,
        }),
      ]);

      return { employees: [], attendance, leave, payroll };
    }
  }
}
