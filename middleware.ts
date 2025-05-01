import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Paths that don't require authentication
const publicPaths = ['/sign-in', '/sign-up', '/403'];

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
    console.log('Middleware triggered for:', request.nextUrl.pathname);

    // First, handle internationalization
    const response = intlMiddleware(request);

    // Get token from cookies
    const token = request.cookies.get('token');
    console.log('Token:', token?.value || 'No token');

    // Remove locale part from the pathname (e.g., /en/sign-in -> /sign-in)
    const pathnameWithoutLocale = request.nextUrl.pathname.replace(/^\/(en|vi)\//, '/');
    console.log('Pathname without locale:', pathnameWithoutLocale);

    // If user is logged in and trying to access public paths, redirect to home
    if (token && publicPaths.includes(pathnameWithoutLocale)) {
        console.log('Logged-in user accessing public path, redirecting to /');
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Handle /admin/* paths (with or without locale prefix)
    if (
        pathnameWithoutLocale.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/en/admin') ||
        request.nextUrl.pathname.startsWith('/vi/admin')
    ) {
        console.log('Admin path detected');
        // If no token, redirect to sign-in
        if (!token) {
            console.log('No token, redirecting to /sign-in');
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        try {
            // Decode token to get user role
            const decoded = jwtDecode(token.value) as DecodedToken;
            console.log('Decoded token:', decoded);

            // Only allow admin role to access admin paths
            if (decoded.role !== 'admin') {
                console.log('Non-admin role, redirecting to /403');
                return NextResponse.redirect(new URL('/403', request.url));
            }
        } catch (error) {
            console.error('Invalid token, redirecting to /sign-in:', error);
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    console.log('Allowing request to proceed');
    return response;
}

export const config = {
    matcher: ['/', '/(en|vi)/:path*', '/sign-in', '/sign-up', '/403', '/admin/:path*'],
};

// !!! -------------------- temp --------------------------- !!

// import createMiddleware from 'next-intl/middleware';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { jwtDecode } from 'jwt-decode';

// // Paths that don't require authentication
// const publicPaths = ['/sign-in', '/sign-up'];

// interface DecodedToken {
//     userId: string;
//     role: string;
// }

// // Middleware for handling internationalization
// const intlMiddleware = createMiddleware({
//     locales: ['en', 'vi'],
//     defaultLocale: 'en',
// });

// export async function middleware(request: NextRequest) {
//     // First, handle internationalization
//     const response = intlMiddleware(request);

//     // Then, handle authentication and authorization
//     const token = request.cookies.get('token');

//     // Remove locale part from the pathname (e.g., /en/sign-in -> /sign-in)
//     const pathnameWithoutLocale = request.nextUrl.pathname.replace(/^\/(en|vi)\//, '/');

//     // If user is logged in and trying to access public paths, redirect to home
//     if (token && publicPaths.includes(pathnameWithoutLocale)) {
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     // If has token, check role-based access
//     if (token) {
//         try {
//             // Decode token to get user role
//             const decoded = jwtDecode(token.value) as DecodedToken;

//             // Check if path starts with /admin
//             if (request.nextUrl.pathname.startsWith('/admin')) {
//                 // Only allow admin role to access admin paths
//                 if (decoded.role !== 'admin') {
//                     return NextResponse.redirect(new URL('/', request.url));
//                 }
//             }
//         } catch (error) {
//             // If token is invalid, redirect to sign-in
//             return NextResponse.redirect(new URL('/sign-in', request.url));
//         }
//     }

//     return response;
// }

// export const config = {
//     matcher: [
//         '/',
//         '/(en|vi)/:path*',
//         '/sign-in',
//         '/sign-up',
//         '/admin/:path*', // Match all paths starting with /admin
//     ],
// };
