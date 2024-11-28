import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hasToken = request.cookies.has('next-auth.session-token');
  const requestHeaders = new Headers(request.headers);

  const { pathname } = request.nextUrl;

  requestHeaders.set('x-current-path', pathname);

  const accessPage = pathname.startsWith('/product') || pathname === '/';
  const signInPage = pathname === '/auth/sign-in';

  if (!hasToken && !signInPage && !accessPage) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (hasToken && signInPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
