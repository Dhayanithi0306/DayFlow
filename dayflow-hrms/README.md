# DAYFLOW HRMS

## Description

DAYFLOW HRMS is a modern, full-stack Human Resource Management System built with React, TypeScript, Express, Prisma, and PostgreSQL. It features employee self-service, administrative HR management, role-based access control, attendance tracking, leave request processing, and payroll analytics.

## Technology Stack

### Frontend
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma ORM
- **Database**: PostgreSQL
- **Security**: JWT (JSON Web Tokens) & bcrypt

## Project Structure

```
dayflow-hrms/
├── frontend/             # React + Vite TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components & error boundaries
│   │   ├── pages/        # Route pages
│   │   ├── layouts/      # App layouts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services (Axios)
│   │   ├── context/      # React contexts
│   │   ├── types/        # TypeScript interfaces & types
│   │   ├── utils/        # Utility helpers
│   │   ├── routes/       # Router configurations
│   │   ├── assets/       # Static assets
│   │   ├── App.tsx       # Main app container
│   │   └── main.tsx      # App entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Node.js + Express TypeScript backend
│   ├── src/
│   │   ├── config/       # Database & server configurations
│   │   ├── controllers/  # API request handlers
│   │   ├── middleware/   # Express middleware (error handling, auth)
│   │   ├── routes/       # API endpoints definition
│   │   ├── services/     # Business logic layer
│   │   ├── utils/        # Helpers & formatters
│   │   ├── types/        # Backend TypeScript types
│   │   ├── app.ts        # Express app configuration
│   │   └── server.ts     # Express server entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema definition
│   └── package.json
├── .gitignore
├── README.md
└── package.json          # Root workspace configuration
```

## Development Setup

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(Or install inside `frontend` and `backend` separately using `npm install`)*

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in `backend/`:
```bash
cp backend/.env.example backend/.env
```
Update `DATABASE_URL` with your PostgreSQL database credentials:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dayflow_hrms?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

Copy `.env.example` to `.env` in `frontend/`:
```bash
cp frontend/.env.example frontend/.env
```

### 3. Run Prisma Setup (Database Migration)
```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Start Development Mode
From root:
```bash
npm run dev
```
- Backend API will run on `http://localhost:5000`
- Frontend UI will run on `http://localhost:5173`

## Health Verification Endpoints
- **Backend API status**: `GET http://localhost:5000/api/health`
- **Database status**: `GET http://localhost:5000/api/health/db`
