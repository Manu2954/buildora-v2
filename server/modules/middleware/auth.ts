import type { Request, RequestHandler } from "express";
import { verifyAccessToken } from "../lib/jwt";
import { verifyAccessToken } from "../lib/jwt";

export type AuthedRequest = {
  user?: { id: string; role: "ADMIN" | "SALESMAN" | "CUSTOMER" };
} & Request;

export const requireAuth: RequestHandler = (req, res, next) => {
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });
  const token = auth.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    (req as any).user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (roles: Array<"ADMIN" | "SALESMAN" | "CUSTOMER">): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user as { id: string; role: string } | undefined;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(user.role as any)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
};

// Simple API key guard for CTA admin endpoints
export const requireApiKey: RequestHandler = (req, res, next) => {
  const provided = req.header("x-api-key") || (req.query.key as string | undefined);
  const expected = process.env.API_KEY;
  if (!expected) return res.status(500).json({ message: "API not configured" });
  if (!provided || provided !== expected) return res.status(401).json({ message: "Invalid API key" });
  next();
};

// Admin guard: allow either API key OR JWT with ADMIN role
export const adminGuard: RequestHandler = (req, res, next) => {
  const provided = req.header("x-api-key") || (req.query.key as string | undefined);
  const expected = process.env.API_KEY;
  if (provided && expected && provided === expected) return next();
  // Fallback to JWT
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });
  const token = auth.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    if (payload.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" });
    (req as any).user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
