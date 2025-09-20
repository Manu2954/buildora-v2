import { z } from "zod";

export const DesignBudgetSchema = z.enum(["BASIC", "PREMIUM", "LUXURY"]);

export const DesignsListQuerySchema = z.object({
  category: z.string().optional(),
  style: z.string().optional(),
  budget: DesignBudgetSchema.optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const DesignCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  category: z.string().max(200).optional(),
  style: z.string().max(200).optional(),
  budget: DesignBudgetSchema.default("BASIC").optional(),
  basePriceCents: z.coerce.number().int().nonnegative(),
  durationDays: z.coerce.number().int().positive().optional(),
  images: z.array(z.string().url()).default([]).optional(),
  customizationOptions: z.record(z.any()).optional(),
  active: z.boolean().optional(),
});

export const DesignUpdateSchema = DesignCreateSchema.partial();

