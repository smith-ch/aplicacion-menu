'use client';

const TOKEN_KEY = 'ps_token';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token: string | null) {
  try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); } catch { /* sin almacenamiento */ }
}

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

/** Cliente del API (vía proxy /api de Next). Acepta JSON o FormData. */
export async function api<T = unknown>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (options.body instanceof FormData) body = options.body;
  else if (options.body !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(options.body); }

  const res = await fetch(`/api${path}`, { method: options.method ?? (body ? 'POST' : 'GET'), headers, body });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join('. ') : data?.message || 'Ocurrió un error inesperado';
    if (res.status === 401 && token) setToken(null);
    throw new ApiError(msg, res.status);
  }
  return data as T;
}
