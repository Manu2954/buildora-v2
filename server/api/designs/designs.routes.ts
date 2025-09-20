import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { adminGuard } from "../../modules/middleware/auth";
import { createDesignAdmin, deleteDesignAdmin, getDesignPublic, listDesignsAdmin, listDesignsPublic, updateDesignAdmin } from "./designs.controller";

export const designsRouter = Router();
export const adminDesignsRouter = Router();

// Public
designsRouter.get("/designs", asyncHandler(listDesignsPublic));
designsRouter.get("/designs/:id", asyncHandler(getDesignPublic));

// Admin
adminDesignsRouter.get("/designs", adminGuard, asyncHandler(listDesignsAdmin));
adminDesignsRouter.post("/designs", adminGuard, asyncHandler(createDesignAdmin));
adminDesignsRouter.put("/designs/:id", adminGuard, asyncHandler(updateDesignAdmin));
adminDesignsRouter.delete("/designs/:id", adminGuard, asyncHandler(deleteDesignAdmin));

