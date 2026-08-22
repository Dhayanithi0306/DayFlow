import { PrismaClient, EmploymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { CreateEmployeeInput, UpdateEmployeeInput, SelfProfileUpdateInput, validateCreateEmployee, validateSelfProfileUpdate } from '../validators/employeeValidators.js';

const SALT_ROUNDS = 10;
const DEFAULT_TEMP_PASSWORD = 'TempPassword@123';

export interface EmployeeQueryParams {
  search?: string;
  departmentId?: string;
  employmentStatus?: EmploymentStatus;
  page?: number;
  limit?: number;
}

export class EmployeeService {
  /**
   * Helper algorithm to generate business Employee ID (e.g. DAYSL20260001)
   */
  private static generateEmployeeId(companyCode: string, firstName: string, lastName: string, joiningDate: Date, sequenceNum: number): string {
    const prefix = (companyCode || 'DAY').toUpperCase().substring(0, 3);
    const fInitial = firstName.trim().charAt(0).toUpperCase() || 'X';
    const lInitial = lastName.trim().charAt(0).toUpperCase() || 'X';
    const year = joiningDate.getFullYear().toString();
    const serial = sequenceNum.toString().padStart(4, '0');

    return `${prefix}${fInitial}${lInitial}${year}${serial}`;
  }

  /**
   * Get Self Profile for authenticated user
   */
  static async getSelfProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: true,
        employee: {
          include: {
            department: true,
            manager: {
              include: {
                user: { select: { email: true } },
              },
            },
            privateInfo: true,
            documents: true,
            salaryStructures: {
              orderBy: { effectiveFrom: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!user || !user.employee) {
      throw { statusCode: 404, message: 'Employee profile not found for authenticated user.' };
    }

    return user.employee;
  }

  /**
   * Update Self Profile (Limited allowed contact fields only)
   */
  static async updateSelfProfile(userId: string, input: SelfProfileUpdateInput) {
    const validation = validateSelfProfileUpdate(input);
    if (!validation.isValid) {
      throw { statusCode: 400, message: validation.message };
    }

    const employee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee profile not found.' };
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employee.id },
      data: {
        phone: input.phone !== undefined ? input.phone : employee.phone,
        address: input.address !== undefined ? input.address : employee.address,
        city: input.city !== undefined ? input.city : employee.city,
        state: input.state !== undefined ? input.state : employee.state,
        postalCode: input.postalCode !== undefined ? input.postalCode : employee.postalCode,
        country: input.country !== undefined ? input.country : employee.country,
        profilePictureUrl: input.profilePictureUrl !== undefined ? input.profilePictureUrl : employee.profilePictureUrl,
      },
      include: {
        department: true,
        manager: true,
        privateInfo: true,
      },
    });

    // Write Audit Log
    await prisma.auditLog.create({
      data: {
        companyId: employee.companyId,
        userId: userId,
        action: 'EMPLOYEE_PROFILE_UPDATED',
        entityType: 'EMPLOYEE',
        entityId: employee.id,
        description: 'Employee updated self contact profile information.',
      },
    });

    return updatedEmployee;
  }

  /**
   * List employees for Admin (Search, Filter, Pagination)
   */
  static async listEmployees(companyId: string, params: EmployeeQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const whereClause: any = { companyId };

    if (params.departmentId) {
      whereClause.departmentId = params.departmentId;
    }

    if (params.employmentStatus) {
      whereClause.employmentStatus = params.employmentStatus;
    }

    if (params.search && params.search.trim()) {
      const search = params.search.trim();
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, email: true, role: true, isActive: true, isEmailVerified: true },
          },
          department: true,
          manager: {
            select: { id: true, firstName: true, lastName: true, employeeId: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.employee.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      page,
      limit,
      total,
      totalPages,
    };
  }

  /**
   * Get single employee by ID for Admin
   */
  static async getEmployeeById(companyId: string, employeeId: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        companyId,
      },
      include: {
        user: {
          select: { id: true, email: true, role: true, isActive: true, isEmailVerified: true, mustChangePassword: true, lastLoginAt: true },
        },
        department: true,
        manager: {
          select: { id: true, firstName: true, lastName: true, employeeId: true },
        },
        directReports: {
          select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true },
        },
        privateInfo: true,
        bankAccount: true,
        documents: true,
        salaryStructures: {
          orderBy: { effectiveFrom: 'desc' },
        },
      },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee not found.' };
    }

    return employee;
  }

  /**
   * Admin Create Employee (Prisma Transaction + Auto ID generation + Temp Password)
   */
  static async createEmployee(adminUserId: string, companyId: string, input: CreateEmployeeInput) {
    const validation = validateCreateEmployee(input);
    if (!validation.isValid) {
      throw { statusCode: 400, message: validation.message };
    }

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw { statusCode: 404, message: 'Company not found.' };
    }

    // Check duplicate user email within company
    const existingUser = await prisma.user.findFirst({
      where: {
        companyId,
        email: input.email.trim().toLowerCase(),
      },
    });

    if (existingUser) {
      throw { statusCode: 400, message: 'A user with this email address already exists in the company.' };
    }

    // Check department exists
    const department = await prisma.department.findFirst({
      where: { id: input.departmentId, companyId },
    });
    if (!department) {
      throw { statusCode: 400, message: 'Selected department does not exist.' };
    }

    // Check manager exists if provided
    if (input.managerId) {
      const manager = await prisma.employee.findFirst({
        where: { id: input.managerId, companyId },
      });
      if (!manager) {
        throw { statusCode: 400, message: 'Selected manager does not exist.' };
      }
    }

    const joiningDate = new Date(input.joiningDate);
    const count = await prisma.employee.count({ where: { companyId } });

    // Generate unique employee ID
    const generatedId = this.generateEmployeeId(company.code, input.firstName, input.lastName, joiningDate, count + 1);

    const tempPassword = DEFAULT_TEMP_PASSWORD;
    const passwordHash = await bcrypt.hash(tempPassword, SALT_ROUNDS);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User with mustChangePassword = true
      const newUser = await tx.user.create({
        data: {
          companyId,
          email: input.email.trim().toLowerCase(),
          passwordHash,
          role: input.role || 'EMPLOYEE',
          isActive: true,
          isEmailVerified: true, // Verified by Admin onboarding
          mustChangePassword: true,
        },
      });

      // 2. Create Employee
      const newEmployee = await tx.employee.create({
        data: {
          userId: newUser.id,
          companyId,
          employeeId: generatedId,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          phone: input.phone || null,
          joiningDate,
          employmentStatus: EmploymentStatus.ACTIVE,
          designation: input.designation.trim(),
          departmentId: input.departmentId,
          managerId: input.managerId || null,
          location: input.location || null,
          address: input.address || null,
          city: input.city || null,
          state: input.state || null,
          postalCode: input.postalCode || null,
          country: input.country || null,
        },
      });

      // 3. Create empty private info
      await tx.employeePrivateInfo.create({
        data: {
          employeeId: newEmployee.id,
          personalEmail: input.email.trim().toLowerCase(),
        },
      });

      // 4. Create Audit Log
      await tx.auditLog.create({
        data: {
          companyId,
          userId: adminUserId,
          action: 'EMPLOYEE_CREATED',
          entityType: 'EMPLOYEE',
          entityId: newEmployee.id,
          description: `Admin created new employee ${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.employeeId}).`,
        },
      });

      return newEmployee;
    });

    const fullEmployee = await this.getEmployeeById(companyId, result.id);

    return {
      employee: fullEmployee,
      tempPassword, // Returned for dev demonstration
      message: `Employee ${fullEmployee.firstName} ${fullEmployee.lastName} created successfully.`,
    };
  }

  /**
   * Admin Update Employee
   */
  static async updateEmployee(adminUserId: string, companyId: string, employeeId: string, input: UpdateEmployeeInput) {
    const existing = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!existing) {
      throw { statusCode: 404, message: 'Employee not found.' };
    }

    if (input.managerId && input.managerId === employeeId) {
      throw { statusCode: 400, message: 'An employee cannot be their own manager.' };
    }

    const updated = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        firstName: input.firstName !== undefined ? input.firstName.trim() : existing.firstName,
        lastName: input.lastName !== undefined ? input.lastName.trim() : existing.lastName,
        phone: input.phone !== undefined ? input.phone : existing.phone,
        joiningDate: input.joiningDate ? new Date(input.joiningDate) : existing.joiningDate,
        designation: input.designation !== undefined ? input.designation.trim() : existing.designation,
        departmentId: input.departmentId !== undefined ? input.departmentId : existing.departmentId,
        managerId: input.managerId !== undefined ? input.managerId || null : existing.managerId,
        location: input.location !== undefined ? input.location : existing.location,
        address: input.address !== undefined ? input.address : existing.address,
        city: input.city !== undefined ? input.city : existing.city,
        state: input.state !== undefined ? input.state : existing.state,
        postalCode: input.postalCode !== undefined ? input.postalCode : existing.postalCode,
        country: input.country !== undefined ? input.country : existing.country,
        employmentStatus: input.employmentStatus || existing.employmentStatus,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'EMPLOYEE_UPDATED',
        entityType: 'EMPLOYEE',
        entityId: updated.id,
        description: `Admin updated employee details for ${updated.employeeId}.`,
      },
    });

    return this.getEmployeeById(companyId, updated.id);
  }

  /**
   * Admin Update Employee Lifecycle Status
   */
  static async updateEmployeeStatus(adminUserId: string, companyId: string, employeeId: string, status: EmploymentStatus) {
    const existing = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!existing) {
      throw { statusCode: 404, message: 'Employee not found.' };
    }

    const updated = await prisma.employee.update({
      where: { id: employeeId },
      data: { employmentStatus: status },
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        userId: adminUserId,
        action: 'EMPLOYEE_STATUS_CHANGED',
        entityType: 'EMPLOYEE',
        entityId: updated.id,
        description: `Employee ${updated.employeeId} status changed to ${status}.`,
      },
    });

    return this.getEmployeeById(companyId, updated.id);
  }

  /**
   * Get Employee Document Metadata
   */
  static async getEmployeeDocuments(companyId: string, employeeId: string) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee not found.' };
    }

    return prisma.employeeDocument.findMany({
      where: { employeeId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  /**
   * Get Employee Salary Structure Metadata
   */
  static async getEmployeeSalary(companyId: string, employeeId: string) {
    const employee = await prisma.employee.findFirst({
      where: { id: employeeId, companyId },
    });

    if (!employee) {
      throw { statusCode: 404, message: 'Employee not found.' };
    }

    return prisma.salaryStructure.findMany({
      where: { employeeId },
      orderBy: { effectiveFrom: 'desc' },
    });
  }
}
