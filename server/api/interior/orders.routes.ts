import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { adminGuard, requireAuth } from "../../modules/middleware/auth";
import { addItemHandler, adminGetHandler, adminListHandler, adminUpdateHandler, createDraftHandler, deleteItemHandler, getOrderHandler, listOrdersHandler, submitOrderHandler, updateItemHandler } from "./orders.controller";

export const interiorOrdersRouter = Router();
export const adminInteriorOrdersRouter = Router();

// Customer routes
interiorOrdersRouter.post("/orders", requireAuth, asyncHandler(createDraftHandler));
interiorOrdersRouter.get("/orders", requireAuth, asyncHandler(listOrdersHandler));
interiorOrdersRouter.get("/orders/:id", requireAuth, asyncHandler(getOrderHandler));
interiorOrdersRouter.post("/orders/:orderId/items", requireAuth, asyncHandler(addItemHandler));
interiorOrdersRouter.put("/orders/:orderId/items/:itemId", requireAuth, asyncHandler(updateItemHandler));
interiorOrdersRouter.delete("/orders/:orderId/items/:itemId", requireAuth, asyncHandler(deleteItemHandler));
interiorOrdersRouter.post("/orders/:orderId/submit", requireAuth, asyncHandler(submitOrderHandler));

// Admin routes
adminInteriorOrdersRouter.get("/orders", adminGuard, asyncHandler(adminListHandler));
adminInteriorOrdersRouter.get("/orders/:id", adminGuard, asyncHandler(adminGetHandler));
adminInteriorOrdersRouter.put("/orders/:id", adminGuard, asyncHandler(adminUpdateHandler));

