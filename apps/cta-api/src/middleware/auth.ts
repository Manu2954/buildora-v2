import type { NextFunction, Request, Response } from 'express';
import { env } from '../env.js';

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== env.API_KEY) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

