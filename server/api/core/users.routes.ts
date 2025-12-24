import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { requireAuth, requireRole } from "../../modules/middleware/auth";
import { prisma } from "../../prisma/client";

export const usersRouter = Router();

// GET /api/core/users?role=SALESMAN
usersRouter.get(
  "/users",
  requireAuth,
  requireRole(["ADMIN"]),
  asyncHandler(async (req, res) => {
    const role = (req.query.role as string | undefined) ?? undefined;
    const where: any = {};
    if (role) where.role = role;
    const users = await prisma.user.findMany({ where, select: { id: true, email: true, role: true } });
    res.json({ users });
  })
);

