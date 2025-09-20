import { z } from "zod";

export const InteriorStatusSchema = z.enum([
  "QUOTATION_PENDING",
  "IN_PROGRESS",
  "MATERIAL_PROCUREMENT",
  "EXECUTION",
  "COMPLETED",
  "CANCELLED",
]);

export const InteriorItemStatusSchema = z.enum(["DRAFT", "FINALIZED"]);

export const CreateDraftOrderSchema = z.object({
  // allows starting empty; items can be added later
});

export const AddItemSchema = z.object({
  designId: z.string().min(1),
  selectedOptions: z.record(z.any()).optional(),
  quantity: z.coerce.number().int().positive().default(1),
  room: z.string().max(200).optional(),
});

export const UpdateItemSchema = z.object({
  selectedOptions: z.record(z.any()).optional(),
  quantity: z.coerce.number().int().positive().optional(),
  room: z.string().max(200).optional(),
  status: InteriorItemStatusSchema.optional(),
});

export const SubmitOrderSchema = z.object({
  consultationRequested: z.boolean().default(true).optional(),
  preferredAt: z.string().datetime().optional(),
  message: z.string().max(2000).optional(),
});

export const AdminListOrdersQuery = z.object({
  status: z.enum(["all", "QUOTATION_PENDING", "IN_PROGRESS", "MATERIAL_PROCUREMENT", "EXECUTION", "COMPLETED", "CANCELLED"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const AdminUpdateOrderSchema = z.object({
  status: InteriorStatusSchema.optional(),
  milestones: z.array(
    z.object({ label: z.string(), amountCents: z.coerce.number().int().nonnegative(), status: z.enum(["PENDING", "PAID", "APPROVED", "REJECTED"]).default("PENDING"), approved: z.boolean().default(false) })
  ).optional(),
  discountsCents: z.coerce.number().int().nonnegative().optional(),
  extrasCents: z.coerce.number().int().nonnegative().optional(),
  invoices: z.array(z.object({ id: z.string(), label: z.string().optional(), url: z.string().url(), uploadedAt: z.string() })).optional(),
  consultationAt: z.string().datetime().optional(),
  meetingNotes: z.string().max(5000).optional(),
});

