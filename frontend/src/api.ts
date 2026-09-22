/** Base URL for API requests. Empty string uses same-origin relative paths in production. */
export const API_URL = import.meta.env.VITE_API_URL ?? '';

export function apiPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

export function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
