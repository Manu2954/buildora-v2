import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { requireApiKey } from "../../modules/middleware/auth";
import { analyticsHandler, getConfigHandler, putConfigHandler, submitHandler } from "./cta.controller";

export const ctaRouter = Router();

// Public
ctaRouter.get("/config", asyncHandler(getConfigHandler));
ctaRouter.post("/submit", asyncHandler(submitHandler));

// Admin
ctaRouter.put("/config", requireApiKey, asyncHandler(putConfigHandler));
ctaRouter.get("/analytics", requireApiKey, asyncHandler(analyticsHandler));

