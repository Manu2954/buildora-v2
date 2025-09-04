import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireApiKey } from '../middleware/auth.js';
import { notifyAll } from '../services/notifier.js';
import { analyticsSummary } from '../services/analytics.js';

export const ctaRouter = Router();

// GET /api/cta/config?key=...
const ConfigQuerySchema = z.object({ key: z.string().min(1) });
ctaRouter.get('/config', async (req, res, next) => {
  try {
    const { key } = ConfigQuerySchema.parse(req.query);
    const cfg = await prisma.ctaConfig.findUnique({ where: { key } });
    res.json({ key, config: (cfg?.json as Record<string, unknown>) ?? {} });
  } catch (err) {
    next(err);
  }
});

// PUT /api/cta/config (admin)
const ConfigBodySchema = z.object({
  key: z.string().min(1),
  config: z.record(z.any()),
});
ctaRouter.put('/config', requireApiKey, async (req, res, next) => {
  try {
    const { key, config } = ConfigBodySchema.parse(req.body);
    await prisma.ctaConfig.upsert({
      where: { key },
      create: { key, json: config },
      update: { json: config },
    });
    res.json({ ok: true, key });
  } catch (err) {
    next(err);
  }
});

// POST /api/cta/submit
// Accepts core CTA page fields and maps to Lead columns
const SubmitSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  location: z.string().min(1).max(300),
  // Frontend sends a combined requirement string; backend accepts that
  requirement: z.string().min(1).max(500),
  // Consent is required on the page; enforce true here
  consent: z.boolean().refine((v) => v === true, { message: 'Consent required' }),

  // Optional extras
  email: z.string().email().optional(),
  message: z.string().max(1000).optional(),
  page: z.string().max(200).optional(),
  variant: z.string().max(50).optional(),
  source: z.string().max(50).optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  fingerprint: z.string().max(120).optional(),
});

ctaRouter.post('/submit', async (req, res, next) => {
  try {
    const data = SubmitSchema.parse(req.body);
    const ip = req.ip;
    const userAgent = (req.headers['user-agent'] as string | undefined) ?? undefined;

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        location: data.location,
        requirement: data.requirement,
        page: data.page,
        variant: data.variant,
        source: data.source,
        utmSource: data.utm?.source,
        utmMedium: data.utm?.medium,
        utmCampaign: data.utm?.campaign,
        utmTerm: data.utm?.term,
        utmContent: data.utm?.content,
        fingerprint: data.fingerprint,
        ip,
        userAgent,
      },
    });

    // Fire-and-forget notifications
    // Intentionally not awaiting to avoid delaying response; but ensure logging in notifier
    notifyAll(lead).catch(() => {});

    res.status(201).json({ id: lead.id });
  } catch (err) {
    next(err);
  }
});

// GET /api/cta/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD (admin)
const AnalyticsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

ctaRouter.get('/analytics', requireApiKey, async (req, res, next) => {
  try {
    const { from, to } = AnalyticsQuerySchema.parse(req.query);
    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T23:59:59.999Z`);
    const summary = await analyticsSummary(fromDate, toDate);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});
