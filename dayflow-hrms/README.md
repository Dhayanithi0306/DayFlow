# DAYFLOW HRMS — Human Resource Management System

DAYFLOW HRMS is a complete, enterprise-grade Human Resource Management System built with React, TypeScript, Vite, Tailwind CSS, Node.js, Express, PostgreSQL, and Prisma ORM.

---

## 🌟 Key Features

### 1. Authentication & Security
- Hashed passwords using `bcrypt` (10 rounds) with strict complexity validation.
- JWT-based authentication with role-based access control (`ADMIN` vs `EMPLOYEE`).
- Mandatory first-login password change (`mustChangePassword`).
- Rate limiting middleware (`express-rate-limit`) protecting login & auth endpoints.
- Security headers configured via `helmet` and strict CORS origin checks.
- Audit logging for all authentication, leave, salary, and administrative actions.

### 2. Employee Management & Profiles
- Admin employee directory with search, department filtering, status updates, and creation modals.
- Self-service employee profiles for managing emergency contacts, address, and profile picture.
- Strict data privacy preventing cross-employee profile access.

### 3. Attendance Management
- Real-time check-in and check-out with live session duration timer.
- Server-authoritative calculation of working hours and overtime minutes.
- Admin attendance portal with filterable logs and correction overrides.

### 4. Time Off / Leave Management
- Leave balance tracking (`Paid`, `Sick`, `Unpaid` leave).
- Date duration calculation and active leave request overlap prevention.
- Admin approval and rejection workflow with balance updates and notifications.

### 5. Payroll & Salary Management
- Centralized Decimal-safe calculation engine (`Gross = Basic + HRA + Standard + Bonus + LTA + Fixed`, `Deductions = PF + Tax`, `Net = Gross - Deductions`).
- Historical salary versioning (`SalaryStructure` records with `effectiveFrom`).
- Monthly batch payroll generation linked with attendance and approved leave counts.
- Read-only payslip portal for employees.

### 6. Real Dashboards & Database Notifications
- PostgreSQL-backed Employee Dashboard (greeting, CheckInCard, summary metrics, upcoming leaves).
- Admin Executive Dashboard (active headcount, daily attendance breakdown, pending leave queue, net payroll outflow, audit log).
- Database notification triggers (`LEAVE_SUBMITTED`, `LEAVE_APPROVED`, `LEAVE_REJECTED`, `SALARY_UPDATED`, `PAYROLL_GENERATED`, `ATTENDANCE_UPDATED`) with real-time unread badge counter in top navbar.

### 7. Reports, Recharts Analytics & CSV Exports
- Paginated, whitelisted reports (`Employee Report`, `Attendance Report`, `Leave Report`, `Payroll Report`).
- CSV export engine with CSV formula injection sanitization (`=`, `+`, `-`, `@` escaped).
- Interactive HR Analytics portal powered by **Recharts** (7-day attendance trend, leave distribution donut chart, department attendance comparison, payroll outflow comparison).
- Role-aware global search bar in top navbar.

---

## 🚀 Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, Recharts.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, bcrypt, jsonwebtoken, helmet, express-rate-limit.
- **Database:** PostgreSQL 16 (`dayflow_hrms`).
- **Containerization:** Docker, Docker Compose, Nginx.

---

## 💻 Clean Machine Setup Guide (Zero Setup)

Prerequisites: Node.js (v18+), PostgreSQL 16, Git.

```bash
# 1. Clone the repository
git clone https://github.com/Dhayanithi0306/DayFlow.git
cd DayFlow/dayflow-hrms

# 2. Install Root, Backend & Frontend Dependencies
npm run install:all

# 3. Configure Backend Environment
cp backend/.env.example backend/.env
# Update DATABASE_URL in backend/.env if necessary

# 4. Run Prisma Database Migrations & Generate Client
cd backend
npx prisma migrate dev --name init
npx prisma generate

# 5. Seed Development Database
npm run seed

# 6. Start Development Servers (Backend on :5000, Frontend on :5173)
cd ..
npm run dev
```

---

## 🐳 Docker Deployment Guide

```bash
# Build and run containers via Docker Compose
docker-compose up --build -d

# Check running container statuses
docker-compose ps

# Stop containers
docker-compose down
```

---

## 🔑 Seeded Development Credentials

- **Admin Account:** `admin.dev@dayflow.tech` / `Admin@123456`
- **Employee Account:** `alex.dev@dayflow.tech` / `Employee@123456` (Employee ID: `DAYENG20260002`)

---

## 🛡️ Authorization & IDOR Security Matrix

| Feature / Resource | Employee Role | Admin Role |
| :--- | :---: | :---: |
| Self Profile View & Edit | ✅ | ✅ |
| View Other Employee Profile | ❌ (403) | ✅ |
| Self Attendance Check-In / Out | ✅ | ✅ |
| View / Correct Other Attendance | ❌ (403) | ✅ |
| Apply for Time Off | ✅ | ✅ |
| Approve / Reject Leave | ❌ (403) | ✅ |
| View Personal Payslip | ✅ (Read-Only) | ✅ |
| Edit Employee Salary | ❌ (403) | ✅ |
| Run Batch Payroll | ❌ (403) | ✅ |
| Access Reports & CSV Exports | ❌ (403) | ✅ |
| Access HR Analytics Dashboard | ❌ (403) | ✅ |
| Access System Audit Logs | ❌ (403) | ✅ |

---

## 🎬 Hackathon Live Demo Walkthrough Sequence

1. **Admin Login:** Log in as `admin.dev@dayflow.tech`.
2. **Executive Overview:** View Admin Dashboard metrics & attendance breakdown.
3. **Employee Directory:** View headcount list and create new employee.
4. **Employee Self-Service:** Log in as `alex.dev@dayflow.tech`, change default password, check in with live session timer.
5. **Time Off Application:** Apply for Paid Leave.
6. **Admin Leave Approval:** Switch to Admin, review pending leave queue, approve request.
7. **Real Notification:** Observe notification badge increment in top navbar for Employee.
8. **Salary Update & Payroll:** Update salary structure as Admin (history preserved), run monthly payroll batch.
9. **Reports & CSV Export:** Filter Attendance & Payroll reports, click "Export CSV" to download sanitized file.
10. **Recharts Analytics & Search:** View 7-day attendance trends, department outflow graphs, and search via TopNavbar.
