import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const authRoutes = ['/sign-in', '/sign-up'];
const protectedRoutes = ['/lookout', '/xql', '/settings', '/searches', '/admin'];
const ACCESS_STATUS_PATH = '/api/auth/access-status';

function clearAuthCookies(response: NextResponse) {
  const expired = {
    value: '',
    expires: new Date(0),
    path: '/',
  };

  response.cookies.set('better-auth.session_token', '', expired);
  response.cookies.set('__Secure-better-auth.session_token', '', { ...expired, secure: true });
  return response;
}

async function getAccessStatus(request: NextRequest) {
  try {
    const response = await fetch(new URL(ACCESS_STATUS_PATH, request.url), {
      method: 'GET',
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { authenticated: false, isBanned: false } as const;
    }

    const payload = (await response.json()) as {
      authenticated?: boolean;
      isBanned?: boolean;
    };

    return {
      authenticated: Boolean(payload.authenticated),
      isBanned: Boolean(payload.isBanned),
    } as const;
  } catch (error) {
    console.error('Proxy access-status check failed:', error);
    return { authenticated: false, isBanned: false } as const;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/api/search') return NextResponse.next();
  if (pathname.startsWith('/new') || pathname.startsWith('/api/search')) {
    return NextResponse.next();
  }

  // /api/payments/webhooks is a webhook endpoint that should be accessible without authentication
  if (pathname.startsWith('/api/payments/webhooks')) {
    return NextResponse.next();
  }

  // /api/auth/polar/webhooks
  if (pathname.startsWith('/api/auth/polar/webhooks')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/auth/dodopayments/webhooks')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/raycast')) {
    return NextResponse.next();
  }

  if (pathname.startsWith(ACCESS_STATUS_PATH)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const matchesAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const matchesProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // If user is authenticated but trying to access auth routes
  if (sessionCookie && (matchesAuthRoute || matchesProtectedRoute)) {
    const accessStatus = await getAccessStatus(request);

    if (!accessStatus.authenticated) {
      if (matchesProtectedRoute) {
        return clearAuthCookies(NextResponse.redirect(new URL('/sign-in', request.url)));
      }

      return clearAuthCookies(NextResponse.next());
    }

    if (accessStatus.isBanned) {
      if (pathname !== '/banned') {
        return NextResponse.redirect(new URL('/banned', request.url));
      }
      return NextResponse.next();
    }

    if (matchesAuthRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (!sessionCookie && matchesProtectedRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
