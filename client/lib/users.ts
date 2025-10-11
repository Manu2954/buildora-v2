import { apiFetch } from "./api";

export type UserRole = "ADMIN" | "SALESMAN" | "CUSTOMER";

export interface UserSummary {
  id: string;
  email: string;
  role: UserRole;
}

export function listUsers(params: { role?: UserRole } = {}) {
  const search = new URLSearchParams();
  if (params.role) search.set("role", params.role);
  const query = search.toString();
  const path = query ? `/api/core/users?${query}` : "/api/core/users";
  return apiFetch<{ users: UserSummary[] }>(path, { auth: true });
}
