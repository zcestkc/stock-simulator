import { useNotifications } from '@/components/ui/notifications';

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  external?: boolean;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error bodies are plain text ("Not enough cash…") or JSON ({ message } / problem details).
function errorMessage(body: string, fallback: string): string {
  if (!body) return fallback;
  try {
    const json = JSON.parse(body) as { message?: string; title?: string };
    return json.message ?? json.title ?? fallback;
  } catch {
    return body;
  }
}

export const isUnauthorized = (error: unknown) =>
  error instanceof ApiError && error.status === 401;

function buildUrlWithParams(
  url: string,
  params?: RequestOptions['params'],
): string {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>,
  ).toString();
  return `${url}?${queryString}`;
}

export function getServerCookies() {
  if (typeof window !== 'undefined') return '';

  // Dynamic import next/headers only on server-side
  return import('next/headers').then(async ({ cookies }) => {
    try {
      const cookieStore = await cookies();
      return cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');
    } catch (error) {
      console.error('Failed to access cookies:', error);
      return '';
    }
  });
}

// Browser: same-origin /api, proxied to StockSimulatorApi by app/api/[...path]/route.ts (which also
// refreshes expired access tokens). Server: straight to StockSimulatorApi; middleware has already
// ensured a fresh access token for page requests.
function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '/api';
  const url = process.env.API_URL;
  if (!url) throw new Error('API_URL is not set (see .env)');
  return url;
}

async function fetchApi<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    cookie,
    params,
    cache = 'no-store',
    next,
    external = false,
  } = options;

  // Get cookies from the request when running on server
  let cookieHeader = cookie;
  if (typeof window === 'undefined' && !cookie && !external) {
    cookieHeader = await getServerCookies();
  }

  const fullUrl = buildUrlWithParams(
    external ? url : `${getBaseUrl()}${url}`,
    params,
  );

  const response = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
    cache,
    next,
  });

  if (!response.ok) {
    const message = errorMessage(await response.text(), response.statusText);
    // 401 just means "not logged in" — callers decide what to do (e.g. prompt login).
    if (typeof window !== 'undefined' && response.status !== 401) {
      useNotifications.getState().addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
    }
    throw new ApiError(response.status, message);
  }

  // Some endpoints (e.g. logout) may return an empty body
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'POST', body });
  },
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PUT', body });
  },
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PATCH', body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'DELETE' });
  },
};
