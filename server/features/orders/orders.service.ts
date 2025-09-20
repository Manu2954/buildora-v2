import * as repo from "./orders.repo";

export type CreateOrderArgs = Omit<repo.CreateOrderInput, "userId"> & { userId: string };

function calcTotals(items: CreateOrderArgs["items"], shippingCents: number, taxCents: number) {
  const subtotal = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const total = subtotal + shippingCents + taxCents;
  return { subtotalCents: subtotal, totalCents: total };
}

export async function createOrder(args: CreateOrderArgs) {
  const totals = calcTotals(args.items, args.shippingCents, args.taxCents);
  const order = await repo.createOrder(args, totals);
  return order;
}

export async function listMyOrders(userId: string, params: { from?: Date; to?: Date; status?: any; page: number; pageSize: number }) {
  const { rows, total } = await repo.listOrders({ userId, from: params.from, to: params.to, status: params.status, page: params.page, pageSize: params.pageSize });
  return { total, orders: rows };
}

export async function getMyOrder(userId: string, id: string) {
  return repo.getOrderByIdForUser(id, userId);
}

export async function cancelMyOrder(userId: string, id: string) {
  const order = await repo.getOrderByIdForUser(id, userId);
  if (!order) return { error: { status: 404, message: "Not found" } } as const;
  if (order.status !== "PENDING") return { error: { status: 400, message: "Cannot cancel this order" } } as const;
  const updated = await repo.updateOrderStatus(id, "CANCELLED");
  return updated;
}

export async function listOrdersAdmin(params: { from?: Date; to?: Date; status?: any; page: number; pageSize: number; q?: string }) {
  const { rows, total } = await repo.listOrders({ from: params.from, to: params.to, status: params.status, page: params.page, pageSize: params.pageSize, q: params.q });
  return { total, orders: rows };
}

export async function getOrderAdmin(id: string) {
  return repo.getOrderById(id);
}

function canTransition(from: string, to: string) {
  if (from === to) return true;
  switch (from) {
    case "PENDING":
      return to === "PAID" || to === "CANCELLED";
    case "PAID":
      return to === "FULFILLED" || to === "REFUNDED" || to === "CANCELLED";
    case "FULFILLED":
      return to === "REFUNDED"; // allow refund after fulfillment
    case "CANCELLED":
    case "REFUNDED":
      return false; // terminal
    default:
      return false;
  }
}

export async function updateOrderStatusAdmin(id: string, to: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED") {
  const current = await repo.getOrderById(id);
  if (!current) return { error: { status: 404, message: "Not found" } } as const;
  if (!canTransition(current.status, to)) return { error: { status: 400, message: `Invalid transition ${current.status} -> ${to}` } } as const;
  const updated = await repo.updateOrderStatus(id, to);
  return updated;
}

export async function markPaidAdmin(id: string) {
  return updateOrderStatusAdmin(id, "PAID");
}

