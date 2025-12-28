import express, { Request, Response } from 'express';

import patientsRouter from './routes/patients';

const app = express();

app.use(express.json());

app.use('/patients', patientsRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
