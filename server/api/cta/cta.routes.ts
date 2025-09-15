import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { adminGuard } from "../../modules/middleware/auth";
import { analyticsHandler, getConfigHandler, putConfigHandler, submitHandler, leadsListHandler, updateLeadStatusHandler, leadDetailHandler, updateLeadHandler, addNoteHandler } from "./cta.controller";

export const ctaRouter = Router();

// Public
ctaRouter.get("/config", asyncHandler(getConfigHandler));
ctaRouter.post("/submit", asyncHandler(submitHandler));

// Admin
ctaRouter.put("/config", adminGuard, asyncHandler(putConfigHandler));
ctaRouter.get("/analytics", adminGuard, asyncHandler(analyticsHandler));
ctaRouter.get("/leads", adminGuard, asyncHandler(leadsListHandler));
ctaRouter.patch("/leads/:id", adminGuard, asyncHandler(updateLeadStatusHandler));
ctaRouter.get("/leads/:id", adminGuard, asyncHandler(leadDetailHandler));
ctaRouter.patch("/leads/:id/update", adminGuard, asyncHandler(updateLeadHandler));
ctaRouter.post("/leads/:id/notes", adminGuard, asyncHandler(addNoteHandler));
