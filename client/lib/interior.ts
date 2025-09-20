import { apiFetch } from "@/lib/api";
import type { InteriorOrderDTO, InteriorOrderListResponse } from "@shared/api";

export async function createDraftOrder(): Promise<InteriorOrderDTO> {
  return apiFetch(`/api/interior/orders`, { method: "POST", auth: true, body: JSON.stringify({}) });
}

export async function getMyInteriorOrders(page = 1, pageSize = 50): Promise<InteriorOrderListResponse> {
  return apiFetch(`/api/interior/orders?page=${page}&pageSize=${pageSize}`, { auth: true });
}

export async function getInteriorOrder(id: string): Promise<InteriorOrderDTO> {
  return apiFetch(`/api/interior/orders/${id}`, { auth: true });
}

export async function addItem(orderId: string, input: { designId: string; selectedOptions?: Record<string, any>; quantity?: number; room?: string }) {
  return apiFetch(`/api/interior/orders/${orderId}/items`, { method: "POST", auth: true, body: JSON.stringify(input) });
}

export async function updateItem(orderId: string, itemId: string, input: Partial<{ selectedOptions: Record<string, any>; quantity: number; room: string; status: "DRAFT" | "FINALIZED" }>) {
  return apiFetch(`/api/interior/orders/${orderId}/items/${itemId}`, { method: "PUT", auth: true, body: JSON.stringify(input) });
}

export async function deleteItem(orderId: string, itemId: string) {
  return apiFetch(`/api/interior/orders/${orderId}/items/${itemId}`, { method: "DELETE", auth: true });
}

export async function submitOrder(orderId: string, input: { consultationRequested?: boolean; preferredAt?: string; message?: string }) {
  return apiFetch(`/api/interior/orders/${orderId}/submit`, { method: "POST", auth: true, body: JSON.stringify(input) });
}

