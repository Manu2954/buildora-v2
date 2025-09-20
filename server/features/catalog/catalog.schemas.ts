import { z } from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  priceCents: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  active: z.boolean().default(true).optional(),
  // New optional metadata
  materialsUsed: z.string().max(2000).optional(),
  recommendedRoomSize: z.string().max(200).optional(),
  colorPalette: z.string().max(200).optional(),
  designCode: z.string().max(200).optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const ProductListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
  active: z.enum(["true", "false", "all"]).default("true"),
});
