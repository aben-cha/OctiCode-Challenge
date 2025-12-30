import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cors from 'cors';
import helmet from 'helmet';
import { initDatabase } from './services/database';
import config from './config/config';

// Routes
import patientsRouter from './routes/patients';
import notesRouter from './routes/notes';
import summaryRoutes from './routes/summaries';

// Middlewares
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import { authenticate } from './middlewares/auth';
import { rateLimiter } from './middlewares/rateLimiter';

const app = express();

// Initialize database
initDatabase();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (config.nodeEnv === 'development') {
  app.use(logger);
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check (no auth needed)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.use(authenticate);

// Apply rate limiting
app.use('/api', rateLimiter(100, 60000));

// API Routes
app.use('/api/patients', patientsRouter);
app.use('/api', notesRouter);
app.use('/api', summaryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

export default app;
