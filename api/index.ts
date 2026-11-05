import express from 'express';
import cors from 'cors';
import { apiRouter } from '../server/routes.ts';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount apiRouter with and without /api prefix
// so Vercel serverless function handles requests whether the /api prefix is preserved or stripped
app.use('/api', apiRouter);
app.use(apiRouter);

export default app;
