import { Router } from "express";
import { asyncHandler } from "../../modules/middleware/error";
import { adminGuard } from "../../modules/middleware/auth";
import { adminListProductsHandler, createProductHandler, publicListProductsHandler, updateProductHandler } from "./catalog.controller";

export const catalogRouter = Router();
export const adminCatalogRouter = Router();

// Public catalog
catalogRouter.get("/items", asyncHandler(publicListProductsHandler));

// Admin catalog
adminCatalogRouter.get("/items", adminGuard, asyncHandler(adminListProductsHandler));
adminCatalogRouter.post("/items", adminGuard, asyncHandler(createProductHandler));
adminCatalogRouter.patch("/items/:id", adminGuard, asyncHandler(updateProductHandler));
