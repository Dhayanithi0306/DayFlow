import express, { Application } from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app: Application = express();

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes configuration
app.use('/api/health', healthRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
