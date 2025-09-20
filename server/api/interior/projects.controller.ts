import { RequestHandler } from "express";
import { ProjectCreateSchema, ProjectListQuery, ProjectUpdateSchema } from "../../features/interior/projects.schemas";
import * as svc from "../../features/interior/projects.service";

export const createProjectHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const data = ProjectCreateSchema.parse(req.body ?? {});
  const out = await svc.createProject(userId, data);
  res.status(201).json(out);
};

export const updateProjectHandler: RequestHandler = async (req, res) => {
  const data = ProjectUpdateSchema.parse(req.body ?? {});
  const out = await svc.updateProject(req.params.id, data);
  res.json(out);
};

export const getMyProjectHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const out = await svc.getMyProject(userId, req.params.id);
  if (!out) return res.status(404).json({ message: "Not found" });
  res.json(out);
};

export const listMyProjectsHandler: RequestHandler = async (req, res) => {
  const userId = (req as any).user?.id as string;
  const q = ProjectListQuery.parse(req.query);
  const out = await svc.listMyProjects(userId, q.page, q.pageSize);
  res.json(out);
};

// Admin
export const adminListProjectsHandler: RequestHandler = async (req, res) => {
  const q = ProjectListQuery.parse(req.query);
  const out = await svc.listProjectsAdmin(q.page, q.pageSize);
  res.json(out);
};

export const adminGetProjectHandler: RequestHandler = async (req, res) => {
  const out = await svc.getProjectAdmin(req.params.id);
  if (!out) return res.status(404).json({ message: "Not found" });
  res.json(out);
};

