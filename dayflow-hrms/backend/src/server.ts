import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 DAYFLOW HRMS Backend running on port ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  console.log(`🗄️ Database Check URL: http://localhost:${PORT}/api/health/db`);
});

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('\nShutting down server gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Database connections closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
