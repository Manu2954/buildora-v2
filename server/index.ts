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
import { usersRouter } from "./api/core/users.routes";
import { ctaRouter } from "./api/cta/cta.routes";

export function createServer() {
  const app = express();

  // Logger
  const logger = pino({
    level: env.LOG_LEVEL,
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
      autoLogging: {
        ignorePaths: ["/healthz", "/readyz", "/metrics"],
      },
    })
  );

  // API router (apply security only under /api to avoid interfering with Vite dev HTML)
  const api = express.Router();
  const helmetOptions: Parameters<typeof helmet>[0] = env.NODE_ENV === "development"
    ? { contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }
    : {};
  api.use(helmet(helmetOptions));
  app.set("trust proxy", true);
  const corsOrigins = env.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  api.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || corsOrigins.includes("*") || corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  // Parsers
  api.use(express.json({ limit: "1mb" }));
  api.use(express.urlencoded({ extended: true }));

  // Health + Metrics
  registerHealthRoutes(app);
  registerMetrics(app);

  // Example simple routes (under /api)
  api.get("/ping", (_req, res) => {
    res.json({ message: env.PING_MESSAGE ?? "ping" });
  });
  // Removed demo route

  // Core API (auth, protected features) - protected endpoints are inside router
  api.use("/core", coreRouter);
  api.use("/core", usersRouter);

  // CTA API - public submit, admin endpoints; add public rate limit to CTA
  api.use("/cta", publicRateLimiter, ctaRouter);

  // Mount API router
  app.use("/api", api);

  // Central error handler (last)
  app.use(errorHandler);

  return app;
}
