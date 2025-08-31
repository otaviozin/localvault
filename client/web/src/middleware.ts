import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
    { path: '/signin', whenAuthenticated: 'redirect' },
    { path: '/signup', whenAuthenticated: 'redirect' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/signin';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const publicRoute = publicRoutes.find((route) => route.path === path);
    const authToken = request.cookies.get('access_token');

    if (!authToken && publicRoute) {
        return NextResponse.next();
    }

    if (!authToken && !publicRoute) {
        const redirectUrl = request.nextUrl.clone();

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;

        return NextResponse.redirect(redirectUrl);
    }

    if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
        const redirectUrl = request.nextUrl.clone();

        redirectUrl.pathname = '/';

        return NextResponse.redirect(redirectUrl);
    }

    if (authToken && !publicRoute) {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

            const response = await fetch(`${apiUrl}/auth/authorize/me`, {
                headers: {
                    Cookie: `access_token=${authToken.value}`,
                },
            });

            if (response.ok) {
                return NextResponse.next();
            } else {
                const redirectUrl = request.nextUrl.clone();
                redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
                return NextResponse.redirect(redirectUrl);
            }
        } catch (err) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
