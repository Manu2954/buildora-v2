import rateLimit from "express-rate-limit";

export const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
});

