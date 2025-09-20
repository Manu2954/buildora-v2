import { apiFetch } from "@/lib/api";
import type { OrderDTO, OrderListResponse } from "@shared/api";

export type OrdersListParams = {
  status?: "all" | "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  page?: number;
  pageSize?: number;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
};

export async function listMyOrders(params: OrdersListParams = {}): Promise<OrderListResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  const qs = query.toString();
  return apiFetch(`/api/orders${qs ? `?${qs}` : ""}`, { auth: true });
}

export async function cancelMyOrder(id: string): Promise<OrderDTO> {
  return apiFetch(`/api/orders/${id}/cancel`, { method: "PATCH", auth: true });
}

export async function createOrder(input: {
  currency?: string;
  items: Array<{
    productName: string;
    sku?: string | null;
    description?: string | null;
    materialsUsed?: string | null;
    recommendedRoomSize?: string | null;
    colorPalette?: string | null;
    designCode?: string | null;
    unitPriceCents: number;
    quantity: number;
  }>;
  shipping: { name: string; line1: string; line2?: string | null; city: string; state: string; postalCode: string; country: string };
  shippingCents?: number;
  taxCents?: number;
  notes?: string;
}): Promise<OrderDTO> {
  return apiFetch(`/api/orders`, { method: "POST", auth: true, body: JSON.stringify({ currency: input.currency ?? "USD", ...input, shippingCents: input.shippingCents ?? 0, taxCents: input.taxCents ?? 0 }) });
}

export async function getOrder(id: string): Promise<OrderDTO> {
  return apiFetch(`/api/orders/${id}`, { auth: true });
}
