import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Paths that don't require authentication
const publicPaths = ['/sign-in', '/sign-up'];

interface DecodedToken {
    userId: string;
    role: string;
}

// Middleware for handling internationalization
const intlMiddleware = createMiddleware({
    locales: ['en', 'vi'],
    defaultLocale: 'en',
});

export async function middleware(request: NextRequest) {
    // First, handle internationalization
    const response = intlMiddleware(request);

    // Then, handle authentication and authorization
    const token = request.cookies.get('token');

    // Remove locale part from the pathname (e.g., /en/sign-in -> /sign-in)
    const pathnameWithoutLocale = request.nextUrl.pathname.replace(/^\/(en|vi)\//, '/');

    // If user is logged in and trying to access public paths, redirect to home
    if (token && publicPaths.includes(pathnameWithoutLocale)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If has token, check role-based access
    if (token) {
        try {
            // Decode token to get user role
            const decoded = jwtDecode(token.value) as DecodedToken;

            // Check if path starts with /admin
            if (request.nextUrl.pathname.startsWith('/admin')) {
                // Only allow admin role to access admin paths
                if (decoded.role !== 'admin') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        } catch (error) {
            // If token is invalid, redirect to sign-in
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/',
        '/(en|vi)/:path*',
        '/sign-in',
        '/sign-up',
        '/admin/:path*', // Match all paths starting with /admin
    ],
};
