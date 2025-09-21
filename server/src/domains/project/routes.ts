import { Router } from "express";
import { asyncHandler } from "../../../modules/middleware/error";
import { requireAuth } from "../../../modules/middleware/auth";
import {
  addDesignsHandler,
  addMaterialsHandler,
  addMediaHandler,
  attachFileHandler,
  createMilestoneHandler,
  createProjectHandler,
  deleteProjectHandler,
  getProjectHandler,
  listProjectsHandler,
  patchProjectHandler,
  putProjectHandler,
  updateMilestoneHandler,
  upsertClosureHandler,
} from "./controller";

export const projectRouter = Router();

projectRouter.get("/", asyncHandler(listProjectsHandler));
projectRouter.get("/:id", asyncHandler(getProjectHandler));

projectRouter.post("/", requireAuth, asyncHandler(createProjectHandler));
projectRouter.put("/:id", requireAuth, asyncHandler(putProjectHandler));
projectRouter.patch("/:id", requireAuth, asyncHandler(patchProjectHandler));
projectRouter.delete("/:id", requireAuth, asyncHandler(deleteProjectHandler));

projectRouter.post(
  "/:id/milestones",
  requireAuth,
  asyncHandler(createMilestoneHandler),
);
projectRouter.patch(
  "/:id/milestones/:mid",
  requireAuth,
  asyncHandler(updateMilestoneHandler),
);

projectRouter.post(
  "/:id/materials",
  requireAuth,
  asyncHandler(addMaterialsHandler),
);
projectRouter.post(
  "/:id/designs",
  requireAuth,
  asyncHandler(addDesignsHandler),
);
projectRouter.post(
  "/:id/media",
  requireAuth,
  asyncHandler(addMediaHandler),
);
projectRouter.post(
  "/:id/files",
  requireAuth,
  asyncHandler(attachFileHandler),
);
projectRouter.post(
  "/:id/closure",
  requireAuth,
  asyncHandler(upsertClosureHandler),
);
