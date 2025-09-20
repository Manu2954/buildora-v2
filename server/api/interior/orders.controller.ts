import { RequestHandler } from "express";
import { requireAuth } from "../../modules/middleware/auth";
import { AddItemSchema, AdminListOrdersQuery, AdminUpdateOrderSchema, CreateDraftOrderSchema, SubmitOrderSchema, UpdateItemSchema } from "../../features/interior/orders.schemas";
import * as svc from "../../features/interior/orders.service";

export const createDraftHandler: RequestHandler = async (req, res) => {
  const _ = CreateDraftOrderSchema.parse(req.body ?? {});
  const userId = (req as any).user?.id as string;
  const order = await svc.createDraft(userId);
  res.status(201).json(order);
};

export const addItemHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const orderId = req.params.orderId as string;
  const input = AddItemSchema.parse(req.body) as { designId: string; selectedOptions?: any; quantity: number; room?: string };
  const out = await svc.addItem(userId, orderId, input);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.status(201).json(out);
};

export const updateItemHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const orderId = req.params.orderId as string;
  const itemId = req.params.itemId as string;
  const input = UpdateItemSchema.parse(req.body);
  const out = await svc.updateItem(userId, orderId, itemId, input);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};

export const deleteItemHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const orderId = req.params.orderId as string;
  const itemId = req.params.itemId as string;
  const out = await svc.deleteItem(userId, orderId, itemId);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.status(204).end();
};

export const getOrderHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const id = req.params.id as string;
  const order = await svc.getOrder(userId, id);
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
};

export const listOrdersHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const page = Number(req.query.page ?? 1);
  const pageSize = Number(req.query.pageSize ?? 50);
  const out = await svc.listMyOrders(userId, { page, pageSize });
  res.json(out);
};

export const submitOrderHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const id = req.params.orderId as string;
  const input = SubmitOrderSchema.parse(req.body ?? {});
  const out = await svc.submitOrder(userId, id, input);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};

// Admin
export const adminListHandler: RequestHandler = async (req, res) => {
  const q = AdminListOrdersQuery.parse(req.query);
  const status = q.status === "all" ? undefined : q.status;
  const out = await svc.listOrdersAdmin({ status, page: q.page, pageSize: q.pageSize });
  res.json(out);
};

export const adminGetHandler: RequestHandler = async (req, res) => {
  const order = await svc.getOrderAdmin(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
};

export const adminUpdateHandler: RequestHandler = async (req, res) => {
  const data = AdminUpdateOrderSchema.parse(req.body ?? {});
  const order = await svc.updateOrderAdmin(req.params.id, data);
  res.json(order);
};
