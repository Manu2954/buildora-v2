import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { adminGuard, requireAuth } from "../../modules/middleware/auth";
import { adminGetProjectHandler, adminListProjectsHandler, createProjectHandler, getMyProjectHandler, listMyProjectsHandler, updateProjectHandler } from "./projects.controller";

export const projectsRouter = Router();
export const adminProjectsRouter = Router();

projectsRouter.post("/projects", requireAuth, asyncHandler(createProjectHandler));
projectsRouter.get("/projects", requireAuth, asyncHandler(listMyProjectsHandler));
projectsRouter.get("/projects/:id", requireAuth, asyncHandler(getMyProjectHandler));
projectsRouter.put("/projects/:id", requireAuth, asyncHandler(updateProjectHandler));

adminProjectsRouter.get("/projects", adminGuard, asyncHandler(adminListProjectsHandler));
adminProjectsRouter.get("/projects/:id", adminGuard, asyncHandler(adminGetProjectHandler));

