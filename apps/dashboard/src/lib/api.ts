const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
