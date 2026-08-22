import { PrismaClient, UserRole, EmploymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DAYFLOW HRMS Database Seeding...');

  // 1. Create fictional company
  const company = await prisma.company.upsert({
    where: { code: 'DAYFLOW' },
    update: {},
    create: {
      name: 'Dayflow Technologies Inc.',
      code: 'DAYFLOW',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      email: 'contact@dayflow.tech',
      phone: '+1 (555) 019-2834',
      address: '100 Innovation Way, Tech Park',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
    },
  });

  console.log(`✅ Company seeded: ${company.name} (${company.code})`);

  // 2. Create departments
  const departmentNames = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Design',
    'Operations',
  ];

  const departmentsMap: Record<string, string> = {};

  for (const name of departmentNames) {
    const dept = await prisma.department.upsert({
      where: {
        companyId_name: {
          companyId: company.id,
          name,
        },
      },
      update: {},
      create: {
        companyId: company.id,
        name,
        description: `${name} Department at ${company.name}`,
      },
    });
    departmentsMap[name] = dept.id;
  }

  console.log(`✅ ${departmentNames.length} Departments seeded.`);

  // 3. Create Development Passwords (hashed with bcrypt)
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('Admin@123456', saltRounds);
  const employeePasswordHash = await bcrypt.hash('Employee@123456', saltRounds);

  // 4. Create Fictional Admin User & Employee Profile
  const adminUser = await prisma.user.upsert({
    where: {
      companyId_email: {
        companyId: company.id,
        email: 'admin.dev@dayflow.tech',
      },
    },
    update: {},
    create: {
      companyId: company.id,
      email: 'admin.dev@dayflow.tech',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isActive: true,
      isEmailVerified: true,
      mustChangePassword: false,
    },
  });

  const adminEmployee = await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      companyId: company.id,
      employeeId: 'DAYADM20260001',
      firstName: 'Sarah',
      lastName: 'Director',
      phone: '+1 (555) 012-3456',
      joiningDate: new Date('2024-01-15'),
      employmentStatus: EmploymentStatus.ACTIVE,
      designation: 'Head of Human Resources',
      departmentId: departmentsMap['Human Resources'],
      location: 'San Francisco HQ',
    },
  });

  // 5. Create Fictional Standard Employee User & Profile
  const devUser = await prisma.user.upsert({
    where: {
      companyId_email: {
        companyId: company.id,
        email: 'alex.dev@dayflow.tech',
      },
    },
    update: {},
    create: {
      companyId: company.id,
      email: 'alex.dev@dayflow.tech',
      passwordHash: employeePasswordHash,
      role: UserRole.EMPLOYEE,
      isActive: true,
      isEmailVerified: true,
      mustChangePassword: false,
    },
  });

  await prisma.employee.upsert({
    where: { userId: devUser.id },
    update: {},
    create: {
      userId: devUser.id,
      companyId: company.id,
      employeeId: 'DAYENG20260002',
      firstName: 'Alex',
      lastName: 'Developer',
      phone: '+1 (555) 098-7654',
      joiningDate: new Date('2025-03-01'),
      employmentStatus: EmploymentStatus.ACTIVE,
      designation: 'Senior Software Engineer',
      departmentId: departmentsMap['Engineering'],
      managerId: adminEmployee.id,
      location: 'San Francisco HQ',
    },
  });

  // 6. Create Initial Audit Log
  await prisma.auditLog.create({
    area: undefined,
    data: {
      companyId: company.id,
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'COMPANY',
      entityId: company.id,
      description: 'Stage 2 database schema seeded successfully with development data.',
    },
  });

  console.log(`✅ Fictional Admin & Employee profiles seeded.`);
  console.log(`
--------------------------------------------------
[DEVELOPMENT SEED CREDENTIALS]
Admin Email:    admin.dev@dayflow.tech
Admin Pass:     Admin@123456

Employee Email: alex.dev@dayflow.tech
Employee Pass:  Employee@123456
--------------------------------------------------
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
