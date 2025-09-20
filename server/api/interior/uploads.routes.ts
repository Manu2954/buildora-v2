import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { adminGuard, requireAuth } from "../../modules/middleware/auth";
import { upload } from "../../modules/middleware/upload";
import { prisma } from "../../prisma/client";
const db = prisma as any;

export const uploadsRouter = Router();

// Upload media linked to a project; returns URL
uploadsRouter.post("/projects/:id/uploads", requireAuth, upload.single("file"), asyncHandler(async (req, res) => {
  const userId = (req as any).user?.id as string;
  const projectId = req.params.id as string;
  const project = await db.project.findFirst({ where: { id: projectId, customerId: userId } });
  if (!project) return res.status(404).json({ message: "Project not found" });
  const file = (req as any).file!;
  const url = `/uploads/${file.filename}`;
  const uploads = Array.isArray((project as any).mediaUploads) ? (project as any).mediaUploads : [];
  const entry = { id: file.filename, url, label: file.originalname, uploadedAt: new Date().toISOString() };
  uploads.push(entry);
  await db.project.update({ where: { id: projectId }, data: { mediaUploads: uploads as any } });
  res.status(201).json(entry);
}));
