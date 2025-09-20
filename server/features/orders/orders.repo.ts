import { prisma } from "../../prisma/client";

export type CreateOrderInput = {
  userId: string;
  currency: string;
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
  shipping: {
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingCents: number;
  taxCents: number;
  notes?: string | null;
};

export async function createOrder(data: CreateOrderInput, totals: { subtotalCents: number; totalCents: number }) {
  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      status: "PENDING",
      currency: data.currency,
      subtotalCents: totals.subtotalCents,
      taxCents: data.taxCents,
      shippingCents: data.shippingCents,
      totalCents: totals.totalCents,
      shipName: data.shipping.name,
      shipLine1: data.shipping.line1,
      shipLine2: data.shipping.line2 ?? null,
      shipCity: data.shipping.city,
      shipState: data.shipping.state,
      shipPostalCode: data.shipping.postalCode,
      shipCountry: data.shipping.country,
      notes: data.notes ?? null,
      items: {
        createMany: {
          data: data.items.map((i) => ({
            productName: i.productName,
            sku: i.sku ?? null,
            description: i.description ?? null,
            materialsUsed: i.materialsUsed ?? null,
            recommendedRoomSize: i.recommendedRoomSize ?? null,
            colorPalette: i.colorPalette ?? null,
            designCode: i.designCode ?? null,
            unitPriceCents: i.unitPriceCents,
            quantity: i.quantity,
            totalCents: i.unitPriceCents * i.quantity,
          })),
        },
      },
    },
    include: { items: true },
  });
  return order;
}

export async function getOrderByIdForUser(orderId: string, userId: string) {
  return prisma.order.findFirst({ where: { id: orderId, userId }, include: { items: true } });
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({ where: { id: orderId }, include: { items: true, user: { select: { id: true, email: true } } } });
}

export type ListParams = {
  userId?: string;
  status?: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  from?: Date;
  to?: Date;
  page: number;
  pageSize: number;
  q?: string; // for admin email/id search later
};

export async function listOrders(params: ListParams) {
  const where: any = {};
  if (params.userId) where.userId = params.userId;
  if (params.status) where.status = params.status;
  if (params.from || params.to) {
    where.createdAt = {};
    if (params.from) where.createdAt.gte = params.from;
    if (params.to) where.createdAt.lte = params.to;
  }
  if (params.q) {
    // naive search: by id or user email
    where.OR = [
      { id: { contains: params.q } },
      { user: { email: { contains: params.q, mode: "insensitive" } } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
      include: { items: true },
    }),
  ]);

  return { total, rows };
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED") {
  return prisma.order.update({ where: { id: orderId }, data: { status }, include: { items: true } });
}
