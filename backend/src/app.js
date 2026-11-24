import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { config } from './config/env.js';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', config.nodeEnv === 'production' ? 1 : false);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: config.frontendOrigin.split(',').map((origin) => origin.trim()),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '100kb' }));
app.use('/uploads', express.static(path.resolve(config.uploadDir), { fallthrough: false, maxAge: '7d' }));
app.use('/api', api);
app.use(notFound);
app.use(errorHandler);

export default app;
