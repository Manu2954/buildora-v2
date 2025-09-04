import type { NextFunction, Request, Response } from 'express';

// Simple in-memory fixed-window limiter: 60 req/min per IP for public endpoints
const WINDOW_MS = 60_000;
const LIMIT = 60;

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

const publicMatchers = [
  { method: 'GET', pathStartsWith: '/api/health' },
  { method: 'GET', pathStartsWith: '/api/cta/config' },
  { method: 'POST', pathStartsWith: '/api/cta/submit' },
];

function isPublicRoute(req: Request) {
  return publicMatchers.some((m) => req.method === m.method && req.path.startsWith(m.pathStartsWith));
}

export function rateLimitPublic(req: Request, res: Response, next: NextFunction) {
  if (!isPublicRoute(req)) return next();

  const key = `${req.ip}`;
  const now = Date.now();
  const current = store.get(key);
  if (!current || now > current.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= LIMIT) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'rate_limited', retryAfter });
  }

  current.count++;
  next();
}

// Best-effort cleanup every 5 minutes to avoid unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) {
    if (v.resetAt < now) store.delete(k);
  }
}, 300_000).unref();

