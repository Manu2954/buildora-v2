import { RequestHandler } from "express";
import { RegisterSchema, LoginSchema, RefreshSchema } from "../../core/auth/auth.schemas";
import * as svc from "../../core/auth/auth.service";

export const registerHandler: RequestHandler = async (req, res) => {
  const data = RegisterSchema.parse(req.body);
  const out = await svc.register(data as Parameters<typeof svc.register>[0]);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.status(201).json(out);
};

export const loginHandler: RequestHandler = async (req, res) => {
  const data = LoginSchema.parse(req.body);
  const out = await svc.login(data as Parameters<typeof svc.login>[0]);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};

export const refreshHandler: RequestHandler = async (req, res) => {
  const { refreshToken } = RefreshSchema.parse(req.body ?? {});
  const out = await svc.refresh(refreshToken);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};

export const logoutHandler: RequestHandler = async (req, res) => {
  const { refreshToken } = RefreshSchema.parse(req.body ?? {});
  const out = await svc.logout(refreshToken);
  res.json(out);
};

export const meHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string | undefined;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const out = await svc.me(userId);
  if ("error" in out) return res.status(out.error.status).json({ message: out.error.message });
  res.json(out);
};
