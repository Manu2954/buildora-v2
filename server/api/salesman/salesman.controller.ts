import { RequestHandler } from "express";
import { z } from "zod";
import {
  SalesmanEntrySchema,
  SalesmanLeadSchema,
} from "../../features/salesman/salesman.schemas";
import * as svc from "../../features/salesman/salesman.service";

export const createEntryHandler: RequestHandler = async (req, res) => {
  const parsed = SalesmanEntrySchema.parse(req.body);
  const salesmanId = (req as any).user.id;
  const entry = await svc.createEntry(parsed, salesmanId);
  res.status(201).json(entry);
};

export const createLeadHandler: RequestHandler = async (req, res) => {
  const parsed = SalesmanLeadSchema.parse(req.body);
  const salesmanId = (req as any).user.id;
  const lead = await svc.createLead(parsed, salesmanId);
  res.status(201).json({ id: lead.id });
};

export const listMyLeadsHandler: RequestHandler = async (req, res) => {
  const salesmanId = (req as any).user.id;
  const leads = await svc.getSalesmanLeads(salesmanId);
  res.json(leads);
};

export const listAllSalesmanLeadsHandler: RequestHandler = async (_req, res) => {
  const leads = await svc.getAllSalesmanLeads();
  res.json(leads);
};

export const listSalesmenHandler: RequestHandler = async (_req, res) => {
  const salesmen = await svc.getSalesmenWithLeadCounts();
  res.json(salesmen);
};

export const listMyEntriesHandler: RequestHandler = async (req, res) => {
  const salesmanId = (req as any).user.id;
  const entries = await svc.getSalesmanEntries(salesmanId);
  res.json(entries);
};

export const listAllSalesmanEntriesHandler: RequestHandler = async (_req, res) => {
  const entries = await svc.getAllSalesmanEntries();
  res.json(entries);
};

export const endEntryHandler: RequestHandler = async (req, res) => {
  const endTime = z.string().datetime().parse(req.body?.endTime);
  const salesmanId = (req as any).user.id;
  const entryId = req.params.id;
  await svc.endEntry(entryId, endTime, salesmanId);
  res.json({ ok: true });
};
