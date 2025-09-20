import { prisma } from "../../prisma/client";
const db = prisma as any;

export async function createDraft(userId: string) {
  return db.interiorOrder.create({ data: { userId, status: "QUOTATION_PENDING" } });
}

export async function getOrderForUser(id: string, userId: string) {
  return db.interiorOrder.findFirst({ where: { id, userId }, include: { items: true } });
}

export async function addItem(orderId: string, data: { designId: string; title: string; selectedOptions?: any; quantity: number; room?: string | null; computedPriceCents: number }) {
  return db.interiorOrderItem.create({
    data: {
      orderId,
      designId: data.designId,
      title: data.title,
      selectedOptions: data.selectedOptions ?? undefined,
      quantity: data.quantity,
      room: data.room ?? undefined,
      computedPriceCents: data.computedPriceCents,
    },
  });
}

export async function updateItem(orderId: string, itemId: string, data: Partial<{ selectedOptions: any; quantity: number; room: string | null; status: "DRAFT" | "FINALIZED" }>) {
  // ensure belongs to order
  const item = await db.interiorOrderItem.findFirst({ where: { id: itemId, orderId } });
  if (!item) return null;
  return db.interiorOrderItem.update({
    where: { id: itemId },
    data: {
      ...(data.selectedOptions !== undefined ? { selectedOptions: data.selectedOptions } : {}),
      ...(data.quantity !== undefined ? { quantity: data.quantity } : {}),
      ...(data.room !== undefined ? { room: data.room } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    },
  });
}

export async function deleteItem(orderId: string, itemId: string) {
  const item = await db.interiorOrderItem.findFirst({ where: { id: itemId, orderId } });
  if (!item) return null;
  await db.interiorOrderItem.delete({ where: { id: itemId } });
  return true;
}

export async function recalcTotals(orderId: string) {
  const items = await db.interiorOrderItem.findMany({ where: { orderId } });
  const total = items.reduce((s, it) => s + it.computedPriceCents * it.quantity, 0);
  const order = await db.interiorOrder.update({ where: { id: orderId }, data: { totalPriceCents: total } });
  return order;
}

export async function listOrders(userId: string, params: { page: number; pageSize: number }) {
  const where = { userId };
  const [total, orders] = await Promise.all([
    db.interiorOrder.count({ where }),
    db.interiorOrder.findMany({ where, orderBy: { createdAt: "desc" }, skip: (params.page - 1) * params.pageSize, take: params.pageSize, include: { items: true } }),
  ]);
  return { total, orders };
}

export async function submitOrder(id: string, data: { consultationRequested: boolean; consultationAt?: Date | null; meetingNotes?: string | null }) {
  return db.interiorOrder.update({ where: { id }, data: { consultationRequested: data.consultationRequested, consultationAt: data.consultationAt, meetingNotes: data.meetingNotes } });
}

export async function listOrdersAdmin(params: { status?: any; page: number; pageSize: number }) {
  const where: any = {};
  if (params.status) where.status = params.status;
  const [total, orders] = await Promise.all([
    db.interiorOrder.count({ where }),
    db.interiorOrder.findMany({ where, orderBy: { createdAt: "desc" }, skip: (params.page - 1) * params.pageSize, take: params.pageSize, include: { items: true, user: { select: { id: true, email: true } } } }),
  ]);
  return { total, orders };
}

export async function adminGetOrder(id: string) {
  return db.interiorOrder.findUnique({ where: { id }, include: { items: true, user: { select: { id: true, email: true } } } });
}

export async function adminUpdateOrder(id: string, data: Partial<{ status: any; milestones: any[]; discountsCents: number; extrasCents: number; invoices: any[]; consultationAt?: Date | null; meetingNotes?: string | null }>) {
  return db.interiorOrder.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.milestones ? { milestones: data.milestones as any } : {}),
      ...(data.discountsCents !== undefined ? { discountsCents: data.discountsCents } : {}),
      ...(data.extrasCents !== undefined ? { extrasCents: data.extrasCents } : {}),
      ...(data.invoices ? { invoices: data.invoices as any } : {}),
      ...(data.consultationAt !== undefined ? { consultationAt: data.consultationAt } : {}),
      ...(data.meetingNotes !== undefined ? { meetingNotes: data.meetingNotes } : {}),
    },
  });
}
