import * as repo from "./catalog.repo";
import type { z } from "zod";
import { ProductCreateSchema } from "./catalog.schemas";

export function createProduct(data: z.infer<typeof ProductCreateSchema>) {
  return repo.createProduct(data as repo.CreateProductInput);
}

export function updateProduct(id: string, data: Partial<repo.CreateProductInput>) {
  return repo.updateProduct(id, data);
}

export function listProducts(params: { page: number; pageSize: number; q?: string; active?: boolean | undefined }) {
  return repo.listProducts(params);
}

export function getActiveProducts() {
  return repo.getActiveProducts();
}

export function getProduct(id: string) {
  return repo.getProduct(id);
}
