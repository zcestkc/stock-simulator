import { splitCookiesString } from 'set-cookie-parser';

// Server-only helpers for talking to StalkApi. Used by middleware (edge) and the
// /api proxy route (node), so this must only use web-standard APIs.

/** Base URL of StalkApi, e.g. http://localhost:5030/api. Never exposed to the browser. */
export const getApiUrl = (): string => {
  const url = process.env.API_URL;
  if (!url) throw new Error('API_URL is not set (see .env)');
  return url;
};

/** All Set-Cookie headers on a response, as separate strings. */
export const getSetCookies = (response: Response): string[] =>
  typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie()
    : splitCookiesString(response.headers.get('set-cookie') ?? '');

/**
 * Exchanges a refresh token for a new access + refresh token pair.
 * The single place token refresh happens. Returns the API's Set-Cookie headers
 * to forward to the browser, or null if the refresh token is invalid/expired.
 */
export const refreshTokens = async (
  refreshToken: string,
): Promise<string[] | null> => {
  const response = await fetch(`${getApiUrl()}/auth/refresh-token`, {
    method: 'POST',
    headers: { Cookie: `refreshToken=${refreshToken}` },
    cache: 'no-store',
  });
  if (!response.ok) return null;

  const setCookies = getSetCookies(response);
  return setCookies.length > 0 ? setCookies : null;
};

/** name/value pairs from Set-Cookie headers (attributes dropped). */
export const cookiePairs = (setCookies: string[]) =>
  setCookies.map((c) => {
    const pair = c.split(';', 1)[0];
    const eq = pair.indexOf('=');
    return { name: pair.slice(0, eq).trim(), value: pair.slice(eq + 1) };
  });

/** Returns a Cookie request header with the given Set-Cookie values applied on top. */
export const applySetCookies = (
  cookieHeader: string,
  setCookies: string[],
): string => {
  const cookies = new Map(
    cookieHeader
      .split(';')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const eq = c.indexOf('=');
        return [c.slice(0, eq), c.slice(eq + 1)] as const;
      }),
  );
  for (const { name, value } of cookiePairs(setCookies))
    cookies.set(name, value);
  return [...cookies].map(([n, v]) => `${n}=${v}`).join('; ');
};
