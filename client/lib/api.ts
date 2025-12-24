export type ApiOptions = RequestInit & { auth?: boolean };

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL?.trim() || "";

function getTokens() {
  const accessToken = localStorage.getItem("accessToken") || undefined;
  const refreshToken = localStorage.getItem("refreshToken") || undefined;
  return { accessToken, refreshToken };
}

function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export async function apiFetch<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers = new Headers(opts.headers);
  const isFormData =
    typeof FormData !== "undefined" && opts.body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && opts.body instanceof Blob;
  if (!headers.has("Content-Type") && opts.body && !isFormData && !isBlob) {
    headers.set("Content-Type", "application/json");
  }
  if (opts.auth) {
    const { accessToken } = getTokens();
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  }
  let res = await fetch(url, { ...opts, headers });
  if (res.status === 401 && opts.auth) {
    // try refresh
    const { refreshToken } = getTokens();
    if (refreshToken) {
      const r = await fetch(`${API_BASE}/api/core/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (r.ok) {
        const data = await r.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          headers.set("Authorization", `Bearer ${data.accessToken}`);
          res = await fetch(url, { ...opts, headers });
        }
      }
    }
  }
  if (!res.ok) {
    let msg = `Request failed with ${res.status}`;
    try {
      const err = await res.json();
      if (err?.message) msg = err.message;
    } catch {}
    throw new Error(msg);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ accessToken: string; refreshToken: string; user: any }>(
    "/api/core/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    fetch(`${API_BASE}/api/core/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function currentUser<T = { id: string; email: string; role: string } | null>(): T {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null as unknown as T;
  }
}

