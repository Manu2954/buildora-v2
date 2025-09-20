import { RequestHandler } from "express";
import { z } from "zod";
import { CreateOrderSchema, OrdersListQuerySchema, UpdateOrderStatusSchema, AdminOrdersListQuerySchema } from "../../features/orders/orders.schemas";
import * as svc from "../../features/orders/orders.service";

export const createOrderHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const data: z.infer<typeof CreateOrderSchema> = CreateOrderSchema.parse(req.body);
  const out = await svc.createOrder({
    userId,
    currency: data.currency,
    items: data.items,
    shipping: data.shipping,
    shippingCents: data.shippingCents,
    taxCents: data.taxCents,
    notes: data.notes,
  } as any);
  res.status(201).json(out);
};

export const listMyOrdersHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const q = OrdersListQuerySchema.parse(req.query);
  const from = q.from ? new Date(`${q.from}T00:00:00.000Z`) : undefined;
  const to = q.to ? new Date(`${q.to}T23:59:59.999Z`) : undefined;
  const status = q.status === "all" ? undefined : (q.status as any);
  const out = await svc.listMyOrders(userId, { from, to, status, page: q.page, pageSize: q.pageSize });
  res.json(out);
};

export const getMyOrderHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const id = req.params.id as string;
  const order = await svc.getMyOrder(userId, id);
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
};

export const cancelMyOrderHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const id = req.params.id as string;
  const out = await svc.cancelMyOrder(userId, id);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};

export const listOrdersAdminHandler: RequestHandler = async (req, res) => {
  const parsed = AdminOrdersListQuerySchema.parse(req.query as any);
  const from = parsed.from ? new Date(`${parsed.from}T00:00:00.000Z`) : undefined;
  const to = parsed.to ? new Date(`${parsed.to}T23:59:59.999Z`) : undefined;
  const status = parsed.status === "all" ? undefined : (parsed.status as any);
  const out = await svc.listOrdersAdmin({ from, to, status, page: parsed.page, pageSize: parsed.pageSize, q: parsed.q });
  res.json(out);
};

export const getOrderAdminHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const order = await svc.getOrderAdmin(id);
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
};

export const updateOrderStatusAdminHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const { status } = UpdateOrderStatusSchema.parse(req.body);
  const out = await svc.updateOrderStatusAdmin(id, status as any);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};

export const markPaidAdminHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const out = await svc.markPaidAdmin(id);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};
