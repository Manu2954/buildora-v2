import { z } from "zod";

export const ProjectStatusSchema = z.enum([
  "QUOTATION_PENDING",
  "IN_PROGRESS",
  "MATERIAL_PROCUREMENT",
  "EXECUTION",
  "COMPLETED",
  "CANCELLED",
]);

export const ProjectCreateSchema = z.object({
  orderId: z.string().optional(),
  siteLocation: z.string().max(500).optional(),
  salespersonId: z.string().optional(),
  designerId: z.string().optional(),
  contractor: z.string().optional(),
  startDate: z.string().datetime().optional(),
  eta: z.string().datetime().optional(),
  comments: z.string().max(4000).optional(),
  status: ProjectStatusSchema.default("IN_PROGRESS").optional(),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();

export const ProjectListQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

