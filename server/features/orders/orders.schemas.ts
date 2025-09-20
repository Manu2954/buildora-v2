import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FULFILLED",
  "CANCELLED",
  "REFUNDED",
]);

export const OrderItemInputSchema = z.object({
  productName: z.string().min(1).max(200),
  sku: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  materialsUsed: z.string().max(2000).optional(),
  recommendedRoomSize: z.string().max(200).optional(),
  colorPalette: z.string().max(200).optional(),
  designCode: z.string().max(200).optional(),
  unitPriceCents: z.coerce.number().int().nonnegative(),
  quantity: z.coerce.number().int().positive(),
});

export const AddressInputSchema = z.object({
  name: z.string().min(1).max(200),
  line1: z.string().min(1).max(300),
  line2: z.string().max(300).optional(),
  city: z.string().min(1).max(120),
  state: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(30),
  country: z.string().min(2).max(2),
});

export const CreateOrderSchema = z.object({
  currency: z.string().length(3).default("USD"),
  items: z.array(OrderItemInputSchema).min(1),
  shipping: AddressInputSchema,
  shippingCents: z.coerce.number().int().nonnegative().default(0),
  taxCents: z.coerce.number().int().nonnegative().default(0),
  notes: z.string().max(1000).optional(),
});

export const OrdersListQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(["all", "PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
});

export const AdminOrdersListQuerySchema = OrdersListQuerySchema.extend({
  q: z.string().optional(),
});
