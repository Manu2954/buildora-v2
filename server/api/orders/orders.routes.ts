import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { requireAuth, adminGuard } from "../../modules/middleware/auth";
import {
  cancelMyOrderHandler,
  createOrderHandler,
  getMyOrderHandler,
  listMyOrdersHandler,
  getOrderAdminHandler,
  listOrdersAdminHandler,
  updateOrderStatusAdminHandler,
  markPaidAdminHandler,
} from "./orders.controller";

export const ordersRouter = Router();

// Customer endpoints
ordersRouter.get("/", requireAuth, asyncHandler(listMyOrdersHandler));
ordersRouter.get("/:id", requireAuth, asyncHandler(getMyOrderHandler));
ordersRouter.post("/", requireAuth, asyncHandler(createOrderHandler));
ordersRouter.patch("/:id/cancel", requireAuth, asyncHandler(cancelMyOrderHandler));

// Admin endpoints
export const adminOrdersRouter = Router();
adminOrdersRouter.get("/", adminGuard, asyncHandler(listOrdersAdminHandler));
adminOrdersRouter.get("/:id", adminGuard, asyncHandler(getOrderAdminHandler));
adminOrdersRouter.patch("/:id/status", adminGuard, asyncHandler(updateOrderStatusAdminHandler));
adminOrdersRouter.post("/:id/pay", adminGuard, asyncHandler(markPaidAdminHandler));
