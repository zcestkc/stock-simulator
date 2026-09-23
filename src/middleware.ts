import { cookiePairs, refreshTokens } from '@/lib/server/api-upstream';
import { NextResponse, type NextRequest } from 'next/server';

// All pages are public; login is only required for actions on the user's money
// (enforced by StockSimulatorApi, e.g. [Authorize] on PortfolioController).
// This middleware never blocks a page. It only keeps a logged-in user's session fresh:
// if the access token has expired, it refreshes before any server component renders.
export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!refreshToken || request.cookies.has('accessToken')) {
    return NextResponse.next(); // logged out, or access token still valid
  }

  const setCookies = await refreshTokens(refreshToken).catch(() => null);
  if (!setCookies) {
    // Refresh token expired or revoked: continue as a logged-out visitor.
    request.cookies.delete('refreshToken');
    const response = NextResponse.next({
      request: { headers: request.headers },
    });
    response.cookies.delete('refreshToken');
    return response;
  }

  // Apply the new tokens to this request too, so server components rendering it
  // (which read cookies() and prefetch from the API) see them — not just the browser.
  for (const { name, value } of cookiePairs(setCookies)) {
    request.cookies.set(name, value);
  }
  const response = NextResponse.next({ request: { headers: request.headers } });
  for (const cookie of setCookies)
    response.headers.append('set-cookie', cookie);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|sitemap.xml|robots.txt).*)',
  ],
};
