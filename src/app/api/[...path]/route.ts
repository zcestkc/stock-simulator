import {
  applySetCookies,
  getApiUrl,
  getSetCookies,
  refreshTokens,
} from '@/lib/server/api-upstream';
import { NextRequest } from 'next/server';

/*
 * Backend-for-frontend proxy: the browser only ever calls same-origin /api/*,
 * and this forwards to StalkApi. Keeps the API off the public internet, avoids
 * CORS, and handles access-token refresh in one place (retry once on 401).
 */

export const dynamic = 'force-dynamic';

const REQUEST_HEADERS = ['accept', 'content-type', 'cookie'];
const RESPONSE_HEADERS = ['content-type', 'cache-control'];

// These manage tokens themselves; a 401 from them must not trigger a refresh.
const NO_REFRESH = new Set([
  'auth/login',
  'auth/register',
  'auth/logout',
  'auth/refresh-token',
]);

type Context = { params: Promise<{ path: string[] }> };

const proxy = async (request: NextRequest, { params }: Context) => {
  const path = (await params).path.map(encodeURIComponent).join('/');
  const target = `${getApiUrl()}/${path}${request.nextUrl.search}`;

  const headers = new Headers();
  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const body = ['GET', 'HEAD'].includes(request.method)
    ? undefined
    : await request.arrayBuffer();

  const send = (cookie?: string) => {
    const h = new Headers(headers);
    if (cookie !== undefined) h.set('cookie', cookie);
    return fetch(target, {
      method: request.method,
      headers: h,
      body,
      cache: 'no-store',
      redirect: 'manual',
    });
  };

  let upstream: Response;
  let refreshed: string[] = [];
  try {
    upstream = await send();

    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (upstream.status === 401 && refreshToken && !NO_REFRESH.has(path)) {
      const setCookies = await refreshTokens(refreshToken);
      if (setCookies) {
        refreshed = setCookies;
        upstream = await send(
          applySetCookies(headers.get('cookie') ?? '', setCookies),
        );
      }
    }
  } catch (error) {
    console.error(`Proxy to ${target} failed:`, error);
    return Response.json({ message: 'API unavailable' }, { status: 502 });
  }

  const responseHeaders = new Headers();
  for (const name of RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  for (const cookie of [...refreshed, ...getSetCookies(upstream)])
    responseHeaders.append('set-cookie', cookie);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
};

export {
  proxy as DELETE,
  proxy as GET,
  proxy as PATCH,
  proxy as POST,
  proxy as PUT,
};
