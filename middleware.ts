import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hasToken = request.cookies.has('next-auth.session-token');

  if (!hasToken && request.nextUrl.pathname !== '/auth/sign-in') {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (hasToken && request.nextUrl.pathname === '/auth/sign-in') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/sign-in',
    '/admin/:path*',
    '/settings/:path*',
    '/my-account',
    '/cart',
    '/orders',
    '/wish-list',
  ],
};
