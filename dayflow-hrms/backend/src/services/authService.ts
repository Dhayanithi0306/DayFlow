import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../config/db.js';
import { validatePassword } from '../utils/passwordValidator.js';
import { AuthUserSummary, UserRole } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dayflow_hrms_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const SALT_ROUNDS = 10;

export interface SignupInput {
  employeeId: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Helper to format User entity into clean AuthUserSummary
   */
  private static formatUserSummary(user: any): AuthUserSummary {
    return {
      id: user.id,
      companyId: user.companyId,
      email: user.email,
      role: user.role as UserRole,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      mustChangePassword: user.mustChangePassword,
      lastLoginAt: user.lastLoginAt,
      employee: user.employee
        ? {
            id: user.employee.id,
            employeeId: user.employee.employeeId,
            firstName: user.employee.firstName,
            lastName: user.employee.lastName,
            designation: user.employee.designation,
            profilePictureUrl: user.employee.profilePictureUrl,
          }
        : null,
    };
  }

  /**
   * Signup new user using existing Employee record
   */
  static async signup(input: SignupInput) {
    const { employeeId, email, password, role = 'EMPLOYEE' } = input;

    if (!employeeId || !email || !password) {
      throw { statusCode: 400, message: 'Employee ID, email, and password are required.' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw { statusCode: 400, message: 'Invalid email address format.' };
    }

    // Validate password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw { statusCode: 400, message: passwordValidation.message };
    }

    // Restrict public ADMIN role creation
    if (role === 'ADMIN') {
      throw {
        statusCode: 403,
        message: 'Public creation of ADMIN accounts is restricted. Please contact system administrator.',
      };
    }

    // Find employee record by employeeId across company or primary company
    const employee = await prisma.employee.findFirst({
      where: { employeeId: employeeId.trim() },
      include: { company: true },
    });

    if (!employee) {
      throw {
        statusCode: 400,
        message: `Employee ID "${employeeId}" not found in company records. Please contact HR.`,
      };
    }

    // Check if email is already registered in company
    const existingUser = await prisma.user.findFirst({
      where: {
        companyId: employee.companyId,
        email: email.trim().toLowerCase(),
      },
    });

    if (existingUser) {
      throw { statusCode: 400, message: 'An account with this email already exists.' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create User & link with Employee in transaction
    const tokenString = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          companyId: employee.companyId,
          email: email.trim().toLowerCase(),
          passwordHash,
          role: 'EMPLOYEE',
          isActive: true,
          isEmailVerified: false,
          mustChangePassword: false,
        },
      });

      // Connect user to employee
      await tx.employee.update({
        where: { id: employee.id },
        data: { userId: newUser.id },
      });

      // Create Email Verification Token
      const verificationToken = await tx.emailVerificationToken.create({
        data: {
          userId: newUser.id,
          token: tokenString,
          expiresAt: tokenExpiresAt,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          companyId: employee.companyId,
          userId: newUser.id,
          action: 'SIGNUP_SUCCESS',
          entityType: 'USER',
          entityId: newUser.id,
          description: `User signed up successfully with Employee ID ${employee.employeeId}.`,
        },
      });

      return { newUser, verificationToken };
    });

    const userSummary = await this.getCurrentUser(result.newUser.id);

    return {
      user: userSummary,
      verificationToken: result.verificationToken.token, // Returned for dev verification flow
      message: 'Signup successful! Please verify your email to complete registration.',
    };
  }

  /**
   * Verify email using token
   */
  static async verifyEmail(token: string) {
    if (!token) {
      throw { statusCode: 400, message: 'Verification token is required.' };
    }

    const tokenRecord = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.usedAt !== null) {
      throw { statusCode: 400, message: 'Invalid or already used verification token.' };
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw { statusCode: 400, message: 'Verification token has expired. Please request a new one.' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { isEmailVerified: true },
      }),
      prisma.emailVerificationToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          companyId: tokenRecord.user.companyId,
          userId: tokenRecord.userId,
          action: 'EMAIL_VERIFIED',
          entityType: 'USER',
          entityId: tokenRecord.userId,
          description: 'User verified email address successfully.',
        },
      }),
    ]);

    return { message: 'Email address verified successfully! You can now log in.' };
  }

  /**
   * Resend Email Verification Token
   */
  static async resendVerification(email: string): Promise<{ message: string; verificationToken?: string }> {
    const genericResponse = {
      message: 'If an unverified account with this email exists, a verification email has been requested.',
    };

    if (!email) return genericResponse;

    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || user.isEmailVerified) {
      return genericResponse;
    }

    const tokenString = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const tokenRecord = await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: tokenString,
        expiresAt: tokenExpiresAt,
      },
    });

    return {
      message: genericResponse.message,
      verificationToken: tokenRecord.token, // Dev workflow helper
    };
  }

  /**
   * Login user and issue JWT token
   */
  static async login(input: LoginInput) {
    const { email, password } = input;

    if (!email || !password) {
      throw { statusCode: 400, message: 'Email and password are required.' };
    }

    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
      include: {
        employee: true,
        company: true,
      },
    });

    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    if (!user.isActive) {
      throw { statusCode: 403, message: 'Your account is inactive. Please contact HR.' };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      // Audit failed attempt
      await prisma.auditLog.create({
        data: {
          companyId: user.companyId,
          userId: user.id,
          action: 'LOGIN_FAILED',
          entityType: 'USER',
          entityId: user.id,
          description: 'Failed login attempt due to invalid password.',
        },
      });
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    if (!user.isEmailVerified) {
      throw { statusCode: 403, message: 'Please verify your email before signing in.' };
    }

    // Generate JWT payload
    const tokenPayload = {
      sub: user.id,
      role: user.role,
      companyId: user.companyId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    // Update last login timestamp & write audit log
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          companyId: user.companyId,
          userId: user.id,
          action: 'LOGIN_SUCCESS',
          entityType: 'USER',
          entityId: user.id,
          description: 'User logged in successfully.',
        },
      }),
    ]);

    const formattedUser = this.formatUserSummary(user);

    return {
      token,
      user: formattedUser,
      message: 'Login successful.',
    };
  }

  /**
   * Get current authenticated user details
   */
  static async getCurrentUser(userId: string): Promise<AuthUserSummary> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: true,
        company: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found.' };
    }

    return this.formatUserSummary(user);
  }

  /**
   * Change Password (for forced change or profile update)
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) {
      throw { statusCode: 400, message: 'Current password and new password are required.' };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found.' };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 400, message: 'Current password is incorrect.' };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw { statusCode: 400, message: passwordValidation.message };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: newPasswordHash,
          mustChangePassword: false,
        },
      }),
      prisma.auditLog.create({
        data: {
          companyId: user.companyId,
          userId: user.id,
          action: 'PASSWORD_CHANGED',
          entityType: 'USER',
          entityId: user.id,
          description: 'Password changed successfully.',
        },
      }),
    ]);

    return { message: 'Password changed successfully!' };
  }

  /**
   * Request password reset token
   */
  static async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const genericResponse = {
      message: 'If an account exists for this email, a password reset link has been created.',
    };

    if (!email) return genericResponse;

    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return genericResponse;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    const record = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    return {
      message: genericResponse.message,
      resetToken: record.token, // Dev workflow helper
    };
  }

  /**
   * Reset Password with token
   */
  static async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw { statusCode: 400, message: 'Reset token and new password are required.' };
    }

    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.usedAt !== null) {
      throw { statusCode: 400, message: 'Invalid or already used password reset token.' };
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw { statusCode: 400, message: 'Password reset token has expired.' };
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw { statusCode: 400, message: passwordValidation.message };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: {
          passwordHash: newPasswordHash,
          mustChangePassword: false,
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          companyId: tokenRecord.user.companyId,
          userId: tokenRecord.userId,
          action: 'PASSWORD_RESET',
          entityType: 'USER',
          entityId: tokenRecord.userId,
          description: 'Password reset completed via token.',
        },
      }),
    ]);

    return { message: 'Password has been reset successfully. You can now log in with your new password.' };
  }
}
