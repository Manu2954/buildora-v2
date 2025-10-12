import type { ProjectStatus } from "@/components/orders/StatusStepper";
export type { ProjectStatus } from "@/components/orders/StatusStepper";

export const PROJECT_STATUS_LABELS: ProjectStatus[] = [
  "Quotation Pending",
  "In Progress",
  "Material Procurement",
  "Execution",
  "Completed",
  "On Hold",
  "Cancelled",
] as const;

export const PAYMENT_STATUS_LABELS = ["Pending", "Paid", "Partially Paid", "Overdue"] as const;
export const MATERIAL_STATUS_LABELS = ["Planned", "Ordered", "Delivered", "Installed"] as const;
export const MEDIA_KIND_LABELS = ["image", "video"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS_LABELS)[number];
export type MaterialStatus = (typeof MATERIAL_STATUS_LABELS)[number];
export type MediaKind = (typeof MEDIA_KIND_LABELS)[number];

export interface ContactMini {
  name: string;
  phone?: string;
  email?: string;
}

export interface FileRef {
  name: string;
  url: string;
}

export interface Milestone {
  id: string;
  label: string;
  amount: number;
  status: PaymentStatus;
  approved: boolean;
  dueDate?: string;
}

export interface MilestoneInput {
  id?: string;
  label: string;
  amount: number;
  status?: PaymentStatus;
  approved?: boolean;
  dueDate?: string;
}

export interface DesignAsset {
  id: string;
  url: string;
  title?: string;
}

export interface DesignAssetInput {
  id?: string;
  url: string;
  title?: string;
}

export interface MaterialLine {
  id: string;
  type: string;
  brand?: string;
  qty?: string;
  status?: MaterialStatus;
}

export interface MaterialLineInput {
  id?: string;
  type: string;
  brand?: string;
  qty?: string;
  status?: MaterialStatus;
}

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  url: string;
  caption?: string;
}

export interface MediaAssetInput {
  id?: string;
  kind: MediaKind;
  url: string;
  caption?: string;
}

export interface ProjectClosure {
  finalMedia: MediaAsset[];
  certificate?: FileRef;
  warranty?: FileRef;
  afterSales?: ContactMini;
  handoverDate?: string;
  followupDate?: string;
}

export interface ProjectClosureInput {
  finalMedia?: MediaAssetInput[];
  certificate?: FileRef;
  warranty?: FileRef;
  afterSales?: ContactMini;
  handoverDate?: string;
  followupDate?: string;
}

export interface ProjectCustomer {
  id: string;
  email: string;
  role: "ADMIN" | "SALESMAN" | "CUSTOMER";
}

export interface Project {
  id: string;
  address: string;
  type: string;
  status: ProjectStatus;
  customerId?: string;
  customer?: ProjectCustomer;
  salesman?: ContactMini;
  designer?: ContactMini;
  contractor?: ContactMini;
  startDate?: string;
  eta?: string;
  sitePhoto?: string;
  quotationFile?: FileRef;
  discounts: number;
  extras: number;
  invoices: FileRef[];
  milestones: Milestone[];
  designs: DesignAsset[];
  materials: MaterialLine[];
  permits: FileRef[];
  signoffs: FileRef[];
  worksiteMedia: MediaAsset[];
  closure?: ProjectClosure;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectList {
  items: Project[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProjectCreateInput {
  id?: string;
  customerId?: string;
  address: string;
  type: string;
  status?: ProjectStatus;
  salesman?: ContactMini;
  designer?: ContactMini;
  contractor?: ContactMini;
  startDate?: string;
  eta?: string;
  sitePhoto?: string;
  quotationFile?: FileRef;
  discounts?: number;
  extras?: number;
  invoices?: FileRef[];
  milestones?: MilestoneInput[];
  designs?: DesignAssetInput[];
  materials?: MaterialLineInput[];
  permits?: FileRef[];
  signoffs?: FileRef[];
  worksiteMedia?: MediaAssetInput[];
  closure?: ProjectClosureInput;
}

export type ProjectUpsertInput = ProjectCreateInput;
