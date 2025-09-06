import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from './env.js';
import { corsMiddleware } from './middleware/cors.js';
import { rateLimitPublic } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/error.js';
import { Router } from 'express';
import { healthRouter } from './routes/health.js';
import { ctaRouter } from './routes/cta.js';
import { fileURLToPath } from 'url';

export function createApp() {
  const app = express();
  app.set('trust proxy', true);

  const logger = pino({
    level: 'info',
    transport:
      env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  });
  app.use(
    pinoHttp({
      logger,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(corsMiddleware);
  app.use(rateLimitPublic);

  const api = Router();
  api.use(healthRouter);
  api.use('/cta', ctaRouter);
  app.use('/api', api);

  app.use(errorHandler);
  return app;
}

const isMain = fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`CTA API listening on http://localhost:${env.PORT} (env=${env.NODE_ENV})`);
  });
}

export default createApp;

