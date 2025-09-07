import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const log = (req as any).log;
  if (log) {
    log.error({ err }, "Unhandled error");
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      issues: err.issues,
    });
  }

  const status = (err?.status as number) || 500;
  const message = (err?.message as string) || "Internal Server Error";
  res.status(status).json({ message });
};

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

