import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5055),
  DATABASE_URL: z.string().min(1),
  API_KEY: z.string().min(1).default('change-me-at-deploy'),
  ALLOWED_ORIGINS: z
    .string()
    .default('')
    .transform((s) =>
      s
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
    ),
  WEBHOOK_URL: z.string().optional().nullable().transform((v) => (v ? v : undefined)),
  SLACK_WEBHOOK_URL: z.string().optional().nullable().transform((v) => (v ? v : undefined)),
  SMTP_HOST: z.string().optional().nullable().transform((v) => (v ? v : undefined)),
  SMTP_PORT: z.coerce.number().optional().nullable().transform((v) => (v ? v : undefined)),
  SMTP_USER: z.string().optional().nullable().transform((v) => (v ? v : undefined)),
  SMTP_PASS: z.string().optional().nullable().transform((v) => (v ? v : undefined)),
  SMTP_FROM: z.string().optional().nullable().transform((v) => (v ? v : undefined)),
});

export type Env = z.infer<typeof EnvSchema> & { ALLOWED_ORIGINS: string[] };

export const env: Env = EnvSchema.parse(process.env as Record<string, string | undefined>);
