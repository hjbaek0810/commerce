import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { UserRoleType } from '@utils/constants/user';
import { PATH } from '@utils/path';

import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const requestHeaders = new Headers(request.headers);

  const { pathname } = request.nextUrl;

  requestHeaders.set('x-current-path', pathname);

  const isAdmin = token?.user.role === UserRoleType.ADMIN;

  const accessPage = pathname.startsWith('/product') || pathname === '/';
  const signInPage = pathname === PATH.SIGN_IN;
  const signUpPage = pathname === PATH.SIGN_UP;
  const adminPage = pathname.startsWith(PATH.ADMIN.HOME);

  if (!token && !signInPage && !signUpPage && !accessPage) {
    return NextResponse.redirect(new URL(PATH.SIGN_IN, request.url));
  }

  if (token && (signUpPage || signInPage)) {
    return NextResponse.redirect(
      new URL(isAdmin ? PATH.ADMIN.HOME : '/', request.url),
    );
  }

  if (token && !isAdmin && adminPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdmin && !adminPage) {
    return NextResponse.redirect(new URL(PATH.ADMIN.HOME, request.url));
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
