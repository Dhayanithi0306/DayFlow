import { ReportService } from './reportService.js';
import { ReportQueryParams } from '../validators/reportValidators.js';
import { prisma } from '../config/db.js';

export class ExportService {
  /**
   * Helper: Escape CSV formula injection characters (=, +, -, @)
   */
  private static sanitizeCsvCell(val: any): string {
    if (val === null || val === undefined) return '';
    let str = String(val).trim();
    if (/^[=+\-@]/.test(str)) {
      str = `'${str}`;
    }
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Export Employee Report to CSV
   */
  static async exportEmployeesCsv(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const data = await ReportService.getEmployeeReport(adminUserId, companyId, { ...params, limit: 1000 });
    const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Department', 'Designation', 'Joining Date', 'Status'];

    const rows = data.items.map((emp) => [
      this.sanitizeCsvCell(emp.employeeId),
      this.sanitizeCsvCell(emp.firstName),
      this.sanitizeCsvCell(emp.lastName),
      this.sanitizeCsvCell(emp.user?.email),
      this.sanitizeCsvCell(emp.department?.name),
      this.sanitizeCsvCell(emp.designation),
      this.sanitizeCsvCell(emp.joiningDate.toISOString().split('T')[0]),
      this.sanitizeCsvCell(emp.employmentStatus),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_EXPORTED',
        entityType: 'REPORT',
        description: 'Admin exported Employee Report to CSV.',
      },
    });

    return csvContent;
  }

  /**
   * Export Attendance Report to CSV
   */
  static async exportAttendanceCsv(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const data = await ReportService.getAttendanceReport(adminUserId, companyId, { ...params, limit: 1000 });
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Date', 'Check In', 'Check Out', 'Working Mins', 'Extra Mins', 'Status'];

    const rows = data.items.map((att) => [
      this.sanitizeCsvCell(att.employee?.employeeId),
      this.sanitizeCsvCell(`${att.employee?.firstName} ${att.employee?.lastName}`),
      this.sanitizeCsvCell(att.employee?.department?.name),
      this.sanitizeCsvCell(att.date.toISOString().split('T')[0]),
      this.sanitizeCsvCell(att.checkIn ? att.checkIn.toISOString() : ''),
      this.sanitizeCsvCell(att.checkOut ? att.checkOut.toISOString() : ''),
      this.sanitizeCsvCell(att.workingMinutes),
      this.sanitizeCsvCell(att.extraMinutes),
      this.sanitizeCsvCell(att.status),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_EXPORTED',
        entityType: 'REPORT',
        description: 'Admin exported Attendance Report to CSV.',
      },
    });

    return csvContent;
  }

  /**
   * Export Leave Report to CSV
   */
  static async exportLeaveCsv(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const data = await ReportService.getLeaveReport(adminUserId, companyId, { ...params, limit: 1000 });
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Duration (Days)', 'Status', 'Reviewer Comment'];

    const rows = data.items.map((l) => [
      this.sanitizeCsvCell(l.employee?.employeeId),
      this.sanitizeCsvCell(`${l.employee?.firstName} ${l.employee?.lastName}`),
      this.sanitizeCsvCell(l.employee?.department?.name),
      this.sanitizeCsvCell(l.leaveType),
      this.sanitizeCsvCell(l.startDate.toISOString().split('T')[0]),
      this.sanitizeCsvCell(l.endDate.toISOString().split('T')[0]),
      this.sanitizeCsvCell(l.duration),
      this.sanitizeCsvCell(l.status),
      this.sanitizeCsvCell(l.reviewerComment),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_EXPORTED',
        entityType: 'REPORT',
        description: 'Admin exported Leave Report to CSV.',
      },
    });

    return csvContent;
  }

  /**
   * Export Payroll Report to CSV
   */
  static async exportPayrollCsv(adminUserId: string, companyId: string, params: ReportQueryParams) {
    const data = await ReportService.getPayrollReport(adminUserId, companyId, { ...params, limit: 1000 });
    const headers = ['Employee ID', 'Employee Name', 'Department', 'Pay Period Start', 'Pay Period End', 'Gross Salary', 'Total Deductions', 'Net Salary', 'Working Days', 'Present Days'];

    const rows = data.items.map((p) => [
      this.sanitizeCsvCell(p.employee?.employeeId),
      this.sanitizeCsvCell(`${p.employee?.firstName} ${p.employee?.lastName}`),
      this.sanitizeCsvCell(p.employee?.department?.name),
      this.sanitizeCsvCell(p.payPeriodStart.toISOString().split('T')[0]),
      this.sanitizeCsvCell(p.payPeriodEnd.toISOString().split('T')[0]),
      this.sanitizeCsvCell(p.grossSalary),
      this.sanitizeCsvCell(p.totalDeductions),
      this.sanitizeCsvCell(p.netSalary),
      this.sanitizeCsvCell(p.workingDays),
      this.sanitizeCsvCell(p.presentDays),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'REPORT_EXPORTED',
        entityType: 'REPORT',
        description: 'Admin exported Payroll Report to CSV.',
      },
    });

    return csvContent;
  }
}
