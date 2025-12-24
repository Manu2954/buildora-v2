import { apiFetch } from "./api";
import type {
  Project,
  ProjectCreateInput,
  ProjectList,
  ProjectUpsertInput,
} from "./types/project";

export function getProject(projectId: string) {
  return apiFetch<Project>(`/api/projects/${encodeURIComponent(projectId)}`, {
    auth: true,
  });
}

export function listProjects(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  q?: string;
  customerId?: string;
} = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.status) search.set("status", params.status);
  if (params.type) search.set("type", params.type);
  if (params.q) search.set("q", params.q);
  if (params.customerId) search.set("customerId", params.customerId);
  const query = search.toString();
  const path = query ? `/api/projects?${query}` : "/api/projects";
  return apiFetch<ProjectList>(path, { auth: true });
}

export function createProject(payload: ProjectCreateInput) {
  return apiFetch<Project>("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function replaceProject(id: string, payload: ProjectUpsertInput) {
  return apiFetch<Project>(`/api/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function deleteProject(projectId: string) {
  return apiFetch<void>(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
    auth: true,
  });
}
