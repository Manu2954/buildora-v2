import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import { env } from "./modules/config/env";
import { errorHandler } from "./modules/middleware/error";
import { publicRateLimiter } from "./modules/middleware/rateLimit";
import { requestIdGen } from "./modules/lib/logger";
import { registerHealthRoutes } from "./routes/health";
import { registerMetrics } from "./routes/metrics";
import { coreRouter } from "./api/core/auth.routes";
import { ctaRouter } from "./api/cta/cta.routes";

export function createServer() {
  const app = express();

  // Logger
  const logger = pino({
    level: env.NODE_ENV === "development" ? "debug" : "info",
  });
  app.use(
    pinoHttp({
      logger,
      genReqId: requestIdGen,
      customLogLevel: (_req, res, err) => {
        if (res.statusCode >= 500 || err) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
    })
  );

  // Security
  app.use(helmet());
  app.set("trust proxy", true);
  const corsOrigins = env.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || corsOrigins.includes("*") || corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  // Parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health + Metrics
  registerHealthRoutes(app);
  registerMetrics(app);

  // Example simple routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: env.PING_MESSAGE ?? "ping" });
  });
  // Removed demo route

  // Core API (auth, protected features) - protected endpoints are inside router
  app.use("/api/core", coreRouter);

  // CTA API - public submit, admin endpoints with API key; add public rate limit to all CTA routes
  app.use("/api/cta", publicRateLimiter, ctaRouter);

  // Central error handler (last)
  app.use(errorHandler);

  return app;
}
