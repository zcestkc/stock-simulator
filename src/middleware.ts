import { cookiePairs, refreshTokens } from '@/lib/server/api-upstream';
import { NextResponse, type NextRequest } from 'next/server';

// Guards page routes (not /api — the proxy route handles its own refresh).
// Guarantees a valid access token before any server component renders.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth') || pathname === '/') {
    return NextResponse.next(); // Login page or landing page accessed, skipping middleware.
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!refreshToken) return redirectToLogin(request);

  if (request.cookies.has('accessToken')) return NextResponse.next();

  const setCookies = await refreshTokens(refreshToken).catch(() => null);
  if (!setCookies) return redirectToLogin(request); // refresh token expired or revoked

  // Apply the new tokens to this request too, so server components rendering it
  // (which read cookies() and prefetch from the API) see them — not just the browser.
  for (const { name, value } of cookiePairs(setCookies)) {
    request.cookies.set(name, value);
  }
  const response = NextResponse.next({ request: { headers: request.headers } });
  for (const cookie of setCookies) response.headers.append('set-cookie', cookie);
  return response;
}

const redirectToLogin = (request: NextRequest) => {
  const response = NextResponse.redirect(new URL('/auth/login', request.url));
  response.cookies.delete('refreshToken'); // stale token would make "/" think we're logged in
  response.cookies.delete('accessToken');
  return response;
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|sitemap.xml|robots.txt).*)',
  ],
};
