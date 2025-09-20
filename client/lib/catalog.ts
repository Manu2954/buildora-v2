import { apiFetch } from "@/lib/api";
import type { ProductDTO } from "@shared/api";

export async function listPublicProducts(): Promise<{ items: ProductDTO[] }> {
  return apiFetch(`/api/catalog/items`);
}

export async function adminListProducts(params: { page?: number; pageSize?: number; q?: string; active?: "true" | "false" | "all" } = {}) {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.pageSize) sp.set("pageSize", String(params.pageSize));
  if (params.q) sp.set("q", params.q);
  if (params.active) sp.set("active", params.active);
  const qs = sp.toString();
  return apiFetch(`/api/admin/catalog/items${qs ? `?${qs}` : ""}`, { auth: true });
}

export async function adminCreateProduct(input: Partial<ProductDTO> & { name: string; priceCents: number }) {
  return apiFetch(`/api/admin/catalog/items`, { method: "POST", auth: true, body: JSON.stringify(input) });
}

export async function adminUpdateProduct(id: string, input: Partial<ProductDTO>) {
  return apiFetch(`/api/admin/catalog/items/${id}`, { method: "PATCH", auth: true, body: JSON.stringify(input) });
}
