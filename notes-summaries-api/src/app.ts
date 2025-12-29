import express, { Request, Response } from 'express';

import patientsRouter from './routes/patients';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/patients', patientsRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Global error handler
app.use(errorHandler);


export default app;
