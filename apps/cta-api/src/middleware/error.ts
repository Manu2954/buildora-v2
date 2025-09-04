import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'validation_error', details: err.flatten() });
  }
  // eslint-disable-next-line no-console
  console.warn('Unhandled error:', err);
  return res.status(500).json({ error: 'internal_error' });
}

