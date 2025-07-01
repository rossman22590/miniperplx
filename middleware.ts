import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip auth for public routes and assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/sign-in' ||
    pathname === '/sign-up' ||
    pathname === '/error' ||
    pathname === '/verify-request'
  ) {
    return NextResponse.next();
  }

  try {
    // For API routes, handle auth
    if (pathname.startsWith('/api/')) {
      const session = await auth.api.getSession({ 
        headers: request.headers,
        query: { 
          disableCookieCache: true, // Disable cookie caching
          disableRefresh: false // Allow token refresh
        }
      });
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // For protected routes, verify session
    const session = await auth.api.getSession({ 
      headers: request.headers,
      query: { 
        disableCookieCache: true, // Disable cookie caching
        disableRefresh: false // Allow token refresh
      }
    });
    
    // Redirect to sign-in for protected routes when not authenticated
    if (!session && (
      pathname === '/' ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/new') ||
      pathname.startsWith('/search')
    )) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Allow access to public routes
    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // Only redirect to error page for non-API routes
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/error', request.url));
    }
    // For API routes, return error response
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

