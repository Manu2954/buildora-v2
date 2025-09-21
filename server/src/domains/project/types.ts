import { z } from "zod";

export const PROJECT_STATUS_LABELS = [
  "Quotation Pending",
  "In Progress",
  "Material Procurement",
  "Execution",
  "Completed",
  "On Hold",
  "Cancelled",
] as const;

export type ProjectStatusLabel = (typeof PROJECT_STATUS_LABELS)[number];

export const PAYMENT_STATUS_LABELS = [
  "Pending",
  "Paid",
  "Partially Paid",
  "Overdue",
] as const;

export type PaymentStatusLabel = (typeof PAYMENT_STATUS_LABELS)[number];

export const MEDIA_KIND_LABELS = ["image", "video"] as const;

export type MediaKindLabel = (typeof MEDIA_KIND_LABELS)[number];

export const MATERIAL_STATUS_LABELS = [
  "Planned",
  "Ordered",
  "Delivered",
  "Installed",
] as const;

const phoneRegex = /^\+?[0-9 ()-]{7,20}$/;
const dateStringRegex = /^\d{4}-\d{2}-\d{2}$/;

export const ContactMiniSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Invalid phone number format")
    .optional(),
  email: z.string().email().optional(),
});

export type ContactMini = z.infer<typeof ContactMiniSchema>;

export const FileRefSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url(),
});

export type FileRef = z.infer<typeof FileRefSchema>;

export const InvoiceRefSchema = FileRefSchema;
export type InvoiceRef = FileRef;

export const MilestoneSchema = z.object({
  id: z.string().cuid(),
  label: z.string().min(1).max(200),
  amount: z.coerce.number().nonnegative(),
  status: z.enum(PAYMENT_STATUS_LABELS),
  approved: z.boolean(),
  dueDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

export const MilestoneInputSchema = z.object({
  id: z.string().cuid().optional(),
  label: z.string().min(1).max(200),
  amount: z.coerce.number().nonnegative(),
  status: z.enum(PAYMENT_STATUS_LABELS).optional(),
  approved: z.boolean().optional(),
  dueDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
});

export const DesignAssetSchema = z.object({
  id: z.string().cuid(),
  url: z.string().url(),
  title: z.string().max(200).optional(),
});

export type DesignAsset = z.infer<typeof DesignAssetSchema>;

export const DesignAssetInputSchema = z.object({
  id: z.string().cuid().optional(),
  url: z.string().url(),
  title: z.string().max(200).optional(),
});

export type DesignAssetInput = z.infer<typeof DesignAssetInputSchema>;

export const MaterialLineSchema = z.object({
  id: z.string().cuid(),
  type: z.string().min(1).max(120),
  brand: z.string().max(120).optional(),
  qty: z.string().max(120).optional(),
  status: z.enum(MATERIAL_STATUS_LABELS).optional(),
});

export type MaterialLine = z.infer<typeof MaterialLineSchema>;

export const MaterialLineInputSchema = z.object({
  id: z.string().cuid().optional(),
  type: z.string().min(1).max(120),
  brand: z.string().max(120).optional(),
  qty: z.string().max(120).optional(),
  status: z.enum(MATERIAL_STATUS_LABELS).optional(),
});

export type MaterialLineInput = z.infer<typeof MaterialLineInputSchema>;

export const MediaAssetSchema = z.object({
  id: z.string().cuid(),
  kind: z.enum(MEDIA_KIND_LABELS),
  url: z.string().url(),
  caption: z.string().max(200).optional(),
});

export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const MediaAssetInputSchema = z.object({
  id: z.string().cuid().optional(),
  kind: z.enum(MEDIA_KIND_LABELS).optional(),
  url: z.string().url(),
  caption: z.string().max(200).optional(),
});

export type MediaAssetInput = z.infer<typeof MediaAssetInputSchema>;

export const ProjectClosureSchema = z.object({
  finalMedia: z.array(MediaAssetSchema),
  certificate: FileRefSchema.optional(),
  warranty: FileRefSchema.optional(),
  afterSales: ContactMiniSchema.optional(),
  handoverDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  followupDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
});

export type ProjectClosure = z.infer<typeof ProjectClosureSchema>;

export const ProjectClosureInputSchema = z.object({
  finalMedia: z.array(MediaAssetInputSchema).min(1),
  certificate: FileRefSchema.optional(),
  warranty: FileRefSchema.optional(),
  afterSales: ContactMiniSchema.optional(),
  handoverDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  followupDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
});

export const MilestoneUpdateSchema = z.object({
  label: z.string().min(1).max(200).optional(),
  amount: z.coerce.number().nonnegative().optional(),
  status: z.enum(PAYMENT_STATUS_LABELS).optional(),
  approved: z.boolean().optional(),
  dueDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
});

export type MilestoneUpdateInput = z.infer<typeof MilestoneUpdateSchema>;

export const ProjectCreateInputSchema = z.object({
  id: z
    .string()
    .regex(/^[A-Z]{2,4}-\d{4,6}$/)
    .optional(),
  address: z.string().min(1).max(300),
  type: z.string().min(1).max(120),
  status: z.enum(PROJECT_STATUS_LABELS).optional(),
  salesman: ContactMiniSchema.optional(),
  designer: ContactMiniSchema.optional(),
  contractor: ContactMiniSchema.optional(),
  startDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  eta: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  sitePhoto: z.string().url().optional(),
  quotationFile: FileRefSchema.optional(),
  discounts: z.coerce.number().min(0).default(0),
  extras: z.coerce.number().min(0).default(0),
  invoices: z.array(InvoiceRefSchema).default([]),
  milestones: z.array(MilestoneInputSchema).default([]),
  designs: z.array(DesignAssetInputSchema).default([]),
  materials: z.array(MaterialLineInputSchema).default([]),
  permits: z.array(FileRefSchema).default([]),
  signoffs: z.array(FileRefSchema).default([]),
  worksiteMedia: z.array(MediaAssetInputSchema).default([]),
  closure: ProjectClosureInputSchema.optional(),
});

export type ProjectCreateInput = z.infer<typeof ProjectCreateInputSchema>;

export const ProjectUpdateInputSchema = z.object({
  address: z.string().min(1).max(300).optional(),
  type: z.string().min(1).max(120).optional(),
  status: z.enum(PROJECT_STATUS_LABELS).optional(),
  salesman: ContactMiniSchema.optional(),
  designer: ContactMiniSchema.optional(),
  contractor: ContactMiniSchema.optional(),
  startDate: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  eta: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  sitePhoto: z.string().url().optional(),
  quotationFile: FileRefSchema.optional(),
  discounts: z.coerce.number().min(0).optional(),
  extras: z.coerce.number().min(0).optional(),
  invoices: z.array(InvoiceRefSchema).optional(),
  milestones: z.array(MilestoneInputSchema).optional(),
  designs: z.array(DesignAssetInputSchema).optional(),
  materials: z.array(MaterialLineInputSchema).optional(),
  permits: z.array(FileRefSchema).optional(),
  signoffs: z.array(FileRefSchema).optional(),
  worksiteMedia: z.array(MediaAssetInputSchema).optional(),
  closure: ProjectClosureInputSchema.optional(),
  deletedAt: z.never().optional(),
});

export type ProjectUpdateInput = z.infer<typeof ProjectUpdateInputSchema>;

export const ProjectSchema = z.object({
  id: z.string().regex(/^[A-Z]{2,4}-\d{4,6}$/),
  address: z.string().min(1).max(300),
  type: z.string().min(1).max(120),
  status: z.enum(PROJECT_STATUS_LABELS),
  salesman: ContactMiniSchema.optional(),
  designer: ContactMiniSchema.optional(),
  contractor: ContactMiniSchema.optional(),
  startDate: z.string().regex(dateStringRegex, "Invalid date format").optional(),
  eta: z.string().regex(dateStringRegex, "Invalid date format").optional(),
  sitePhoto: z.string().url().optional(),
  quotationFile: FileRefSchema.optional(),
  discounts: z.coerce.number().min(0),
  extras: z.coerce.number().min(0),
  invoices: z.array(InvoiceRefSchema),
  milestones: z.array(MilestoneSchema),
  designs: z.array(DesignAssetSchema),
  materials: z.array(MaterialLineSchema),
  permits: z.array(FileRefSchema),
  signoffs: z.array(FileRefSchema),
  worksiteMedia: z.array(MediaAssetSchema),
  closure: ProjectClosureSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

export type ProjectSummary = {
  items: Project[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export const ProjectListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(PROJECT_STATUS_LABELS).optional(),
  type: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
  startFrom: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  startTo: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  etaFrom: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
  etaTo: z
    .string()
    .regex(dateStringRegex, "Invalid date format")
    .optional(),
});

export type ProjectListQuery = z.infer<typeof ProjectListQuerySchema>;

export const ProjectFileAttachmentSchema = z.object({
  type: z.enum(["invoice", "permit", "signoff"]),
  file: FileRefSchema,
});

export type ProjectFileAttachment = z.infer<typeof ProjectFileAttachmentSchema>;

export const MaterialLinesBatchSchema = z.object({
  materials: z.array(MaterialLineInputSchema).min(1),
});

export const DesignAssetsBatchSchema = z.object({
  designs: z.array(DesignAssetInputSchema).min(1),
});

export const MediaAssetsBatchSchema = z.object({
  media: z.array(MediaAssetInputSchema).min(1),
});

export type MaterialLinesBatch = z.infer<typeof MaterialLinesBatchSchema>;
export type DesignAssetsBatch = z.infer<typeof DesignAssetsBatchSchema>;
export type MediaAssetsBatch = z.infer<typeof MediaAssetsBatchSchema>;

export const MilestoneCreateSchema = MilestoneInputSchema;
export type MilestoneCreateInput = z.infer<typeof MilestoneCreateSchema>;

export const ProjectClosureUpsertSchema = ProjectClosureInputSchema;
export type ProjectClosureUpsertInput = z.infer<typeof ProjectClosureUpsertSchema>;
