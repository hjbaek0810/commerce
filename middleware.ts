import { NextResponse } from 'next/server';

import { PATH } from '@utils/path';

import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hasToken = request.cookies.has('next-auth.session-token');
  const requestHeaders = new Headers(request.headers);

  const { pathname } = request.nextUrl;

  requestHeaders.set('x-current-path', pathname);

  const accessPage = pathname.startsWith('/product') || pathname === '/';
  const signInPage = pathname === PATH.SIGN_IN;
  const signUpPage = pathname === PATH.SIGN_UP;

  if (!hasToken && !signInPage && !signUpPage && !accessPage) {
    // TODO: query reset
    return NextResponse.redirect(new URL(PATH.SIGN_IN, request.url));
  }

  if (hasToken && signUpPage) {
    return NextResponse.redirect(new URL('/', request.url));
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
