import { RequestHandler } from "express";
import { ProductCreateSchema, ProductListQuerySchema, ProductUpdateSchema } from "../../features/catalog/catalog.schemas";
import * as svc from "../../features/catalog/catalog.service";

// Public
export const publicListProductsHandler: RequestHandler = async (_req, res) => {
  const items = await svc.getActiveProducts();
  res.json({ items });
};

// Admin
export const adminListProductsHandler: RequestHandler = async (req, res) => {
  const q = ProductListQuerySchema.parse(req.query);
  const active = q.active === "all" ? undefined : q.active === "true";
  const out = await svc.listProducts({ page: q.page, pageSize: q.pageSize, q: q.q, active });
  res.json(out);
};

export const createProductHandler: RequestHandler = async (req, res) => {
  const data = ProductCreateSchema.parse(req.body);
  const item = await svc.createProduct(data);
  res.status(201).json(item);
};

export const updateProductHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const data = ProductUpdateSchema.parse(req.body);
  const item = await svc.updateProduct(id, data);
  res.json(item);
};

