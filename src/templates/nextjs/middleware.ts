import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling authentication and protected routes
 * 
 * This is a basic example. For full authentication, integrate with NextAuth.js:
 * 
 * import { withAuth } from 'next-auth/middleware';
 * 
 * export default withAuth({
 *   callbacks: {
 *     authorized: ({ token }) => !!token,
 *   },
 * });
 * 
 * export const config = {
 *   matcher: ['/dashboard/:path*', '/api/protected/:path*'],
 * };
 */

export function middleware(request: NextRequest) {
  // Add custom headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

