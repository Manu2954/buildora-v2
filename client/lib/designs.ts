import { apiFetch } from "@/lib/api";
import type { DesignDTO, DesignsListQuery, DesignsListResponse } from "@shared/api";

export async function listDesigns(params: DesignsListQuery = {}): Promise<DesignsListResponse> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.style) qs.set("style", params.style);
  if (params.budget) qs.set("budget", params.budget);
  if (params.q) qs.set("q", params.q);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  const q = qs.toString();
  return apiFetch(`/api/designs${q ? `?${q}` : ""}`);
}

export async function getDesign(id: string): Promise<DesignDTO> {
  return apiFetch(`/api/designs/${id}`);
}

