import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { requireAuth } from "../../modules/middleware/auth";
import { registerHandler, loginHandler, refreshHandler, logoutHandler, meHandler } from "./auth.controller";

export const coreRouter = Router();

coreRouter.post("/auth/register", asyncHandler(registerHandler));
coreRouter.post("/auth/login", asyncHandler(loginHandler));
coreRouter.post("/auth/refresh", asyncHandler(refreshHandler));
coreRouter.post("/auth/logout", asyncHandler(logoutHandler));
coreRouter.get("/auth/me", requireAuth, asyncHandler(meHandler));

