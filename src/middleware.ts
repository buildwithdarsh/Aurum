import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/dashboard', '/accounts', '/transfers', '/cards', '/analytics', '/bills', '/settings'];
const authPaths = ['/auth/login', '/auth/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('aurum-access-token')?.value;

  // Redirect authenticated users away from auth pages
  if (authPaths.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/accounts/:path*',
    '/transfers/:path*',
    '/cards/:path*',
    '/analytics/:path*',
    '/bills/:path*',
    '/settings/:path*',
    '/auth/:path*',
  ],
};
