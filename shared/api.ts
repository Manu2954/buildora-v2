// Shared API DTOs for Orders

export type OrderItemDTO = {
  id: string;
  sku?: string | null;
  productName: string;
  description?: string | null;
  materialsUsed?: string | null;
  recommendedRoomSize?: string | null;
  colorPalette?: string | null;
  designCode?: string | null;
  unitPriceCents: number;
  quantity: number;
  totalCents: number;
};

export type OrderDTO = {
  id: string;
  userId: string;
  status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  currency: string;
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  shipName?: string | null;
  shipLine1?: string | null;
  shipLine2?: string | null;
  shipCity?: string | null;
  shipState?: string | null;
  shipPostalCode?: string | null;
  shipCountry?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemDTO[];
};

export type OrderListResponse = {
  total: number;
  orders: OrderDTO[];
};

// Catalog
export type ProductDTO = {
  id: string;
  sku?: string | null;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  active: boolean;
  materialsUsed?: string | null;
  recommendedRoomSize?: string | null;
  colorPalette?: string | null;
  designCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

// Interior Designs (catalog for interior workflow)
export type DesignBudget = "BASIC" | "PREMIUM" | "LUXURY";

export type DesignDTO = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  style?: string | null;
  budget: DesignBudget;
  basePriceCents: number;
  durationDays?: number | null;
  images: string[]; // URLs
  customizationOptions?: Record<string, any> | null; // schema-free JSON
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DesignsListQuery = {
  category?: string;
  style?: string;
  budget?: DesignBudget;
  q?: string;
  page?: number;
  pageSize?: number;
};

export type DesignsListResponse = { total: number; items: DesignDTO[] };

// Interior Orders (project-style ordering)
export type InteriorOrderStatus =
  | "QUOTATION_PENDING"
  | "IN_PROGRESS"
  | "MATERIAL_PROCUREMENT"
  | "EXECUTION"
  | "COMPLETED"
  | "CANCELLED";

export type InteriorOrderItemStatus = "DRAFT" | "FINALIZED";

export type InteriorOrderItemDTO = {
  id: string;
  designId: string;
  title: string; // snapshot from design
  selectedOptions?: Record<string, any> | null;
  quantity: number;
  status: InteriorOrderItemStatus;
  computedPriceCents: number;
  room?: string | null;
};

export type MilestoneDTO = {
  label: string;
  amountCents: number;
  status: "PENDING" | "PAID" | "APPROVED" | "REJECTED";
  approved: boolean;
};

export type InvoiceDTO = { id: string; label?: string | null; url: string; uploadedAt: string };

export type InteriorOrderDTO = {
  id: string;
  userId: string;
  status: InteriorOrderStatus;
  items: InteriorOrderItemDTO[];
  totalPriceCents: number;
  discountsCents?: number;
  extrasCents?: number;
  milestones: MilestoneDTO[];
  invoices: InvoiceDTO[];
  consultationRequested: boolean;
  consultationAt?: string | null; // ISO
  meetingNotes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InteriorOrderListResponse = { total: number; orders: InteriorOrderDTO[] };

// Projects (execution tracking)
export type ProjectStatus = InteriorOrderStatus;

export type ProjectDTO = {
  id: string;
  orderId?: string | null;
  customerId: string;
  siteLocation?: string | null;
  salespersonId?: string | null;
  designerId?: string | null;
  contractor?: string | null;
  startDate?: string | null;
  eta?: string | null;
  comments?: string | null;
  mediaUploads?: Array<{ id: string; url: string; label?: string | null; uploadedAt: string }>;
  permits?: Array<{ name: string; url: string }>;
  signOffs?: Array<{ name: string; url: string }>;
  handoverData?: Record<string, any> | null;
  rating?: number | null;
  feedback?: string | null;
  supportContact?: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};
