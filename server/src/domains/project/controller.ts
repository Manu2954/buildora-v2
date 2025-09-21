import type { RequestHandler } from "express";
import { projectService } from "./service";
import {
  DesignAssetsBatch,
  DesignAssetsBatchSchema,
  MaterialLinesBatch,
  MaterialLinesBatchSchema,
  MediaAssetsBatch,
  MediaAssetsBatchSchema,
  MilestoneCreateSchema,
  MilestoneUpdateSchema,
  ProjectClosureUpsertSchema,
  ProjectCreateInputSchema,
  ProjectFileAttachmentSchema,
  ProjectListQuerySchema,
  ProjectUpdateInputSchema,
} from "./types";

export const listProjectsHandler: RequestHandler = async (req, res) => {
  const query = ProjectListQuerySchema.parse(req.query);
  const result = await projectService.list(query);
  res.json(result);
};

export const getProjectHandler: RequestHandler = async (req, res) => {
  const project = await projectService.get(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
};

export const createProjectHandler: RequestHandler = async (req, res) => {
  const body = ProjectCreateInputSchema.parse(req.body);
  const project = await projectService.create(body);
  res.status(201).json(project);
};

export const putProjectHandler: RequestHandler = async (req, res) => {
  const body = ProjectCreateInputSchema.parse(req.body);
  const project = await projectService.update(
    req.params.id,
    ProjectUpdateInputSchema.parse({ ...body }),
  );
  res.json(project);
};

export const patchProjectHandler: RequestHandler = async (req, res) => {
  const body = ProjectUpdateInputSchema.parse(req.body);
  const project = await projectService.update(req.params.id, body);
  res.json(project);
};

export const deleteProjectHandler: RequestHandler = async (req, res) => {
  await projectService.delete(req.params.id);
  res.status(204).send();
};

export const createMilestoneHandler: RequestHandler = async (req, res) => {
  const body = MilestoneCreateSchema.parse(req.body);
  const project = await projectService.createMilestone(req.params.id, body);
  res.status(201).json(project);
};

export const updateMilestoneHandler: RequestHandler = async (req, res) => {
  const body = MilestoneUpdateSchema.parse(req.body);
  const project = await projectService.updateMilestone(req.params.id, req.params.mid, body);
  res.json(project);
};

export const addMaterialsHandler: RequestHandler = async (req, res) => {
  const body: MaterialLinesBatch = MaterialLinesBatchSchema.parse(req.body);
  const project = await projectService.addMaterials(req.params.id, body);
  res.status(201).json(project);
};

export const addDesignsHandler: RequestHandler = async (req, res) => {
  const body: DesignAssetsBatch = DesignAssetsBatchSchema.parse(req.body);
  const project = await projectService.addDesigns(req.params.id, body);
  res.status(201).json(project);
};

export const addMediaHandler: RequestHandler = async (req, res) => {
  const body: MediaAssetsBatch = MediaAssetsBatchSchema.parse(req.body);
  const project = await projectService.addMedia(req.params.id, body);
  res.status(201).json(project);
};

export const attachFileHandler: RequestHandler = async (req, res) => {
  const body = ProjectFileAttachmentSchema.parse(req.body);
  const project = await projectService.attachFile(req.params.id, body);
  res.status(201).json(project);
};

export const upsertClosureHandler: RequestHandler = async (req, res) => {
  const body = ProjectClosureUpsertSchema.parse(req.body);
  const project = await projectService.upsertClosure(req.params.id, body);
  const latest = project ?? (await projectService.get(req.params.id));
  res.json(latest);
};
