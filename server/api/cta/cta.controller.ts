import { RequestHandler } from "express";
import { CtaConfigBodySchema, CtaConfigQuerySchema, SubmitSchema, AnalyticsQuerySchema, LeadsQuerySchema, UpdateLeadStatusSchema, UpdateLeadSchema } from "../../features/cta/cta.schemas";
import * as svc from "../../features/cta/cta.service";

export const getConfigHandler: RequestHandler = async (req, res) => {
  const { key } = CtaConfigQuerySchema.parse(req.query);
  const out = await svc.getConfig(key);
  res.json(out);
};

export const putConfigHandler: RequestHandler = async (req, res) => {
  const { key, config } = CtaConfigBodySchema.parse(req.body);
  const out = await svc.putConfig(key, config);
  res.json(out);
};

export const submitHandler: RequestHandler = async (req, res) => {
  const data = SubmitSchema.parse(req.body);
  const out = await svc.submitLead({
    ...data,
    ip: req.ip,
    userAgent: (req.headers["user-agent"] as string | undefined) ?? undefined,
  });
  res.status(201).json(out);
};

export const analyticsHandler: RequestHandler = async (req, res) => {
  const { from, to } = AnalyticsQuerySchema.parse(req.query);
  const out = await svc.analytics(new Date(`${from}T00:00:00.000Z`), new Date(`${to}T23:59:59.999Z`));
  res.json(out);
};

export const leadsListHandler: RequestHandler = async (req, res) => {
  const q = LeadsQuerySchema.parse(req.query);
  const from = q.from ? new Date(`${q.from}T00:00:00.000Z`) : undefined;
  const to = q.to ? new Date(`${q.to}T23:59:59.999Z`) : undefined;
  const status = q.status === "all" ? undefined : (q.status as "NEW" | "CONTACTED" | "CLOSED");
  const out = await svc.leadsList({ from, to, status, q: q.q, page: q.page, pageSize: q.pageSize });
  res.json(out);
};

export const updateLeadStatusHandler: RequestHandler = async (req, res) => {
  const { status } = UpdateLeadStatusSchema.parse(req.body);
  const id = req.params.id as string;
  const out = await svc.updateLeadStatus(id, status);
  res.json(out);
};

export const leadDetailHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const out = await svc.leadDetail(id);
  if (!out) return res.status(404).json({ message: "Not found" });
  res.json(out);
};

export const updateLeadHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const data = UpdateLeadSchema.parse(req.body);
  const actorId = (req as any).user?.id as string | undefined;
  const lead = await svc.updateLead(id, data, actorId);
  res.json(lead);
};

export const addNoteHandler: RequestHandler = async (req, res) => {
  const id = req.params.id as string;
  const content = (req.body?.content as string | undefined) || "";
  if (!content.trim()) return res.status(400).json({ message: "Content required" });
  const authorId = (req as any).user?.id as string | undefined;
  const note = await svc.addLeadNote(id, content, authorId);
  res.status(201).json(note);
};
