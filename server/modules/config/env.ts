import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGINS: z.string().default("http://localhost:8080"),
  PING_MESSAGE: z.string().optional(),

  // Auth (core-api only)
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET is required and should be strong"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET is required and should be strong"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // CTA admin API key (used only for config/analytics)
  API_KEY: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);

