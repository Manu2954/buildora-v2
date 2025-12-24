import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { requireAuth, adminGuard } from "../../modules/middleware/auth";
import {
  createEntryHandler,
  createLeadHandler,
  listMyLeadsHandler,
  listAllSalesmanLeadsHandler,
  listSalesmenHandler,
  listMyEntriesHandler,
  listAllSalesmanEntriesHandler,
  endEntryHandler,
} from "./salesman.controller";

export const salesmanRouter = Router();

// Routes accessible by salesmen
salesmanRouter.post(
  "/entry",
  requireAuth("SALESMAN"),
  asyncHandler(createEntryHandler)
);
salesmanRouter.post(
  "/leads",
  requireAuth("SALESMAN"),
  asyncHandler(createLeadHandler)
);
salesmanRouter.get(
  "/leads",
  requireAuth("SALESMAN"),
  asyncHandler(listMyLeadsHandler)
);
salesmanRouter.get(
  "/entries",
  requireAuth("SALESMAN"),
  asyncHandler(listMyEntriesHandler)
);
salesmanRouter.patch(
  "/entry/:id",
  requireAuth("SALESMAN"),
  asyncHandler(endEntryHandler)
);

// Admin routes to view all salesmen data
salesmanRouter.get(
  "/leads/all",
  adminGuard,
  asyncHandler(listAllSalesmanLeadsHandler)
);
salesmanRouter.get(
  "/salesmen",
  adminGuard,
  asyncHandler(listSalesmenHandler)
);
salesmanRouter.get(
  "/entries/all",
  adminGuard,
  asyncHandler(listAllSalesmanEntriesHandler)
);
