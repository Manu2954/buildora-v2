import { RequestHandler } from "express";
import { DesignsListQuerySchema, DesignCreateSchema, DesignUpdateSchema } from "../../features/designs/designs.schemas";
import * as svc from "../../features/designs/designs.service";

export const listDesignsPublic: RequestHandler = async (req, res) => {
  const q = DesignsListQuerySchema.parse(req.query);
  const out = await svc.listDesigns({ category: q.category, style: q.style, budget: q.budget, q: q.q, page: q.page ?? 1, pageSize: q.pageSize ?? 20, active: true });
  res.json(out);
};

export const getDesignPublic: RequestHandler = async (req, res) => {
  const item = await svc.getDesign(req.params.id);
  if (!item || item.active === false) return res.status(404).json({ message: "Not found" });
  res.json(item);
};

export const listDesignsAdmin: RequestHandler = async (req, res) => {
  const q = DesignsListQuerySchema.parse(req.query);
  const out = await svc.listDesigns({ category: q.category, style: q.style, budget: q.budget, q: q.q, page: q.page ?? 1, pageSize: q.pageSize ?? 20, active: undefined });
  res.json(out);
};

export const createDesignAdmin: RequestHandler = async (req, res) => {
  const data = DesignCreateSchema.parse(req.body);
  const item = await svc.createDesign({
    title: data.title,
    description: data.description,
    category: data.category,
    style: data.style,
    budget: data.budget,
    basePriceCents: data.basePriceCents,
    durationDays: data.durationDays,
    images: data.images ?? [],
    customizationOptions: data.customizationOptions,
    active: data.active,
  });
  res.status(201).json(item);
};

export const updateDesignAdmin: RequestHandler = async (req, res) => {
  const data = DesignUpdateSchema.parse(req.body);
  const item = await svc.updateDesign(req.params.id, data);
  res.json(item);
};

export const deleteDesignAdmin: RequestHandler = async (req, res) => {
  await svc.deleteDesign(req.params.id);
  res.status(204).end();
};
