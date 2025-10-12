import { z } from "zod";

export const CtaConfigQuerySchema = z.object({ key: z.string().min(1) });

export const CtaConfigBodySchema = z.object({
  key: z.string().min(1),
  config: z.record(z.any()),
});

export const SubmitSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(7).max(20),
  location: z.string().min(1).max(300),
  requirement: z.string().min(1).max(500),
  consent: z.boolean().refine((v) => v === true, { message: "Consent required" }),
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

export const AnalyticsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const LeadStatusSchema = z.enum(["NEW", "CONTACTED", "CLOSED"]);

export const LeadsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(["all", "NEW", "CONTACTED", "CLOSED"]).default("all"),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const UpdateLeadStatusSchema = z.object({
  status: LeadStatusSchema,
});

export const UpdateLeadSchema = z.object({
  status: LeadStatusSchema.optional(),
  assignedToId: z.string().cuid().nullable().optional(),
  followUpAt: z.string().datetime().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export type SubmitInput = z.infer<typeof SubmitSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;
export type LeadsQueryInput = z.infer<typeof LeadsQuerySchema>;
export type UpdateLeadStatusInput = z.infer<typeof UpdateLeadStatusSchema>;
