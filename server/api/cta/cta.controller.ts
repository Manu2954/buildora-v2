import { RequestHandler } from "express";
import { CtaConfigBodySchema, CtaConfigQuerySchema, SubmitSchema, AnalyticsQuerySchema } from "../../features/cta/cta.schemas";
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

