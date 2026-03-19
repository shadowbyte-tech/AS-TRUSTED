import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { readUsers } from '@/lib/mongodb-database';

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/premium-dashboard', '/upload', '/admin'];
  const premiumRoutes = ['/premium-dashboard'];
  const ownerRoutes = ['/dashboard', '/upload', '/admin'];

  // Check if route requires protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isPremiumRoute = premiumRoutes.some(route => pathname.startsWith(route));
  const isOwnerRoute = ownerRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    // Get token from cookies
    const token = request.cookies.get('auth_access_token')?.value;

    if (!token) {
      // Redirect to login for protected routes
      return NextResponse.redirect(new URL('/user-login', request.url));
    }

    try {
      // Verify token
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.id) {
        return NextResponse.redirect(new URL('/user-login', request.url));
      }

      // Get user from database
      const users = await readUsers();
      const user = users.find(u => u.id === decoded.id);

      if (!user) {
        return NextResponse.redirect(new URL('/user-login', request.url));
      }

      // Check role-based access
      if (isPremiumRoute && user.role !== 'Premium' && user.role !== 'Owner') {
        return NextResponse.redirect(new URL('/properties', request.url));
      }

      if (isOwnerRoute && user.role !== 'Owner') {
        return NextResponse.redirect(new URL('/properties', request.url));
      }

      // Add user info to request headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', user.id);
      requestHeaders.set('x-user-email', user.email);
      requestHeaders.set('x-user-role', user.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      console.error('Middleware auth error:', error);
      return NextResponse.redirect(new URL('/user-login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/premium-dashboard/:path*',
    '/upload/:path*',
    '/admin/:path*'
  ],
};
