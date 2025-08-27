export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const data = (await res.json()) as T;
  if (!res.ok) {
    const message = (data as any)?.message ?? 'Request failed';
    throw new Error(message);
  }

  return data;
}
