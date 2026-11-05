import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure public and public/uploads exist
  const publicDir = path.resolve(__dirname, 'public');
  const uploadsDir = path.resolve(publicDir, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));
  app.use(express.static(publicDir));

  // Serve local asset images both in development and production
  const srcAssetsDir = path.resolve(__dirname, 'src', 'assets');
  if (fs.existsSync(srcAssetsDir)) {
    app.use('/src/assets', express.static(srcAssetsDir));
  }

  // Mount API router
  app.use('/api', apiRouter);

  // Fallback 404 JSON response for any unhandled /api requests
  app.all('/api/*', (_req, res) => {
    res.status(404).json({ error: 'Endpoint da API não encontrado (404).' });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get('*', (_req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.sendFile(path.resolve(__dirname, 'index.html'));
      }
    });
  }

  // Global Express error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: err?.message || 'Erro interno no servidor.' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Catafy running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
