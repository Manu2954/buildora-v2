import { prisma } from "../../prisma/client";
import * as designs from "../designs/designs.repo";
import * as repo from "./orders.repo";

function computePrice(basePriceCents: number, selectedOptions?: Record<string, any> | null): number {
  // Simple pricing: base + 0 for now; extend with option rules here
  // e.g., if selectedOptions?.material === 'Premium' add 10%
  let price = basePriceCents;
  if (selectedOptions && typeof selectedOptions === "object") {
    if (selectedOptions.material === "Premium") price = Math.round(price * 1.1);
    if (selectedOptions.material === "Luxury") price = Math.round(price * 1.25);
  }
  return price;
}

export async function createDraft(userId: string) {
  return repo.createDraft(userId);
}

export async function addItem(userId: string, orderId: string, input: { designId: string; selectedOptions?: any; quantity: number; room?: string }) {
  const order = await repo.getOrderForUser(orderId, userId);
  if (!order) return { error: { status: 404, message: "Order not found" } } as const;
  const design = await designs.getDesign(input.designId);
  if (!design || design.active === false) return { error: { status: 404, message: "Design not found" } } as const;
  const unit = computePrice(design.basePriceCents, input.selectedOptions);
  const item = await repo.addItem(order.id, { designId: design.id, title: design.title, selectedOptions: input.selectedOptions, quantity: input.quantity, room: input.room, computedPriceCents: unit });
  await repo.recalcTotals(order.id);
  return item;
}

export async function updateItem(userId: string, orderId: string, itemId: string, input: Partial<{ selectedOptions: any; quantity: number; room: string; status: "DRAFT" | "FINALIZED" }>) {
  const order = await repo.getOrderForUser(orderId, userId);
  if (!order) return { error: { status: 404, message: "Order not found" } } as const;
  const updated = await repo.updateItem(orderId, itemId, input);
  if (!updated) return { error: { status: 404, message: "Item not found" } } as const;
  await repo.recalcTotals(order.id);
  return updated;
}

export async function deleteItem(userId: string, orderId: string, itemId: string) {
  const order = await repo.getOrderForUser(orderId, userId);
  if (!order) return { error: { status: 404, message: "Order not found" } } as const;
  const ok = await repo.deleteItem(orderId, itemId);
  if (!ok) return { error: { status: 404, message: "Item not found" } } as const;
  await repo.recalcTotals(order.id);
  return { ok: true } as const;
}

export async function getOrder(userId: string, id: string) {
  return repo.getOrderForUser(id, userId);
}

export async function listMyOrders(userId: string, params: { page: number; pageSize: number }) {
  return repo.listOrders(userId, params);
}

export async function submitOrder(userId: string, id: string, data: { consultationRequested?: boolean; preferredAt?: string; message?: string }) {
  const order = await repo.getOrderForUser(id, userId);
  if (!order) return { error: { status: 404, message: "Order not found" } } as const;
  const updated = await repo.submitOrder(id, { consultationRequested: data.consultationRequested ?? true, consultationAt: data.preferredAt ? new Date(data.preferredAt) : null, meetingNotes: data.message ?? null });
  // TODO: notify admin via email/log mock
  return updated;
}

// Admin
export async function listOrdersAdmin(params: { status?: any; page: number; pageSize: number }) {
  return repo.listOrdersAdmin(params);
}

export async function getOrderAdmin(id: string) {
  return repo.adminGetOrder(id);
}

export async function updateOrderAdmin(id: string, data: Partial<{ status: any; milestones: any[]; discountsCents: number; extrasCents: number; invoices: any[]; consultationAt?: string; meetingNotes?: string }>) {
  return repo.adminUpdateOrder(id, {
    status: data.status,
    milestones: data.milestones,
    discountsCents: data.discountsCents,
    extrasCents: data.extrasCents,
    invoices: data.invoices,
    consultationAt: data.consultationAt ? new Date(data.consultationAt) : undefined,
    meetingNotes: data.meetingNotes,
  });
}

