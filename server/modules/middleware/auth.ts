import type { NextFunction, Request, RequestHandler, Response } from "express";
import { verifyAccessToken } from "../lib/jwt";

type Role = "ADMIN" | "SALESMAN" | "CUSTOMER";

export type AuthedRequest = {
  user?: { id: string; role: Role };
} & Request;

export function requireAuth(req: Request, res: Response, next: NextFunction): void;
export function requireAuth(role: Role | Role[]): RequestHandler;
export function requireAuth(
  ...args: [Request, Response, NextFunction] | [Role | Role[]]
): void | RequestHandler {
  const handle = (req: Request, res: Response, next: NextFunction, roles?: Role[]) => {
    const auth = req.header("authorization");
    if (!auth?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Missing token" });
      return;
    }
    const token = auth.slice("Bearer ".length);
    try {
      const payload = verifyAccessToken(token);
      const user = { id: payload.sub, role: payload.role as Role };
      (req as any).user = user;
      if (roles && roles.length > 0 && !roles.includes(user.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  };

  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    const roles = Array.isArray(args[0]) ? args[0] : [args[0]];
    return (req, res, next) => handle(req, res, next, roles);
  }

  const [req, res, next] = args as [Request, Response, NextFunction];
  return handle(req, res, next);
}

export const requireRole = (roles: Array<Role>): RequestHandler => {
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
